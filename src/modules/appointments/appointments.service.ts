import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { Schedule, ScheduleDocument } from '../schedules/schedule.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/confirm-appointment.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CheckAvailabilityResponse } from './interfaces/check-availability.interface';
import {
  Professional,
  ProfessionalDocument,
} from '../professionals/professionals.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Schedule.name)
    private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Professional.name)
    private professionalModel: Model<ProfessionalDocument>,
  ) {}

  private convertToDate(dateStr: string, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private async checkForOverlappingAppointments(
    scheduleId: string,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    excludeAppointmentId?: string,
  ): Promise<string> {
    const startDateTime = this.convertToDate(startDate, startTime);
    const endDateTime = this.convertToDate(endDate, endTime);

    // Verificar se o schedule existe e obter o professional associado
    const schedule = await this.scheduleModel
      .findById(new Types.ObjectId(scheduleId))
      .populate('professional');
    if (!schedule) {
      throw new BadRequestException('Schedule não encontrado');
    }

    // Verificar conflito de horário no mesmo schedule
    const overlap = await this.appointmentModel.findOne({
      schedule: scheduleId,
      status: { $ne: 'Cancelado' },
      _id: { $ne: excludeAppointmentId },
      $or: [
        {
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: startDate } },
            { startTime: { $lte: startTime } },
            { endTime: { $gt: startTime } },
          ],
        },
        {
          $and: [
            { startDate: { $lte: endDate } },
            { endDate: { $gte: endDate } },
            { startTime: { $lt: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
        {
          $and: [
            { startDate: { $gte: startDate } },
            { endDate: { $lte: endDate } },
          ],
        },
      ],
    });

    if (overlap) {
      throw new BadRequestException('Já existe um agendamento neste horário.');
    }

    return schedule.professional.id.toString();
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const professional = await this.checkForOverlappingAppointments(
      createAppointmentDto.schedule,
      createAppointmentDto.startDate,
      createAppointmentDto.startTime,
      createAppointmentDto.endDate,
      createAppointmentDto.endTime,
    );

    // Garantir que o professional do appointment é o mesmo do schedule
    if (professional !== createAppointmentDto.professional) {
      throw new BadRequestException(
        'O professional do appointment deve ser o mesmo do schedule.',
      );
    }

    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('customer')
      .populate('professional')
      .populate('schedule')
      .populate('services')
      .exec();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('customer')
      .populate('professional')
      .populate('schedule')
      .populate('services')
      .exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const existingAppointment = await this.findOne(id);

    await this.checkForOverlappingAppointments(
      updateAppointmentDto.schedule || existingAppointment.schedule,
      updateAppointmentDto.startDate || existingAppointment.startDate,
      updateAppointmentDto.startTime || existingAppointment.startTime,
      updateAppointmentDto.endDate || existingAppointment.endDate,
      updateAppointmentDto.endTime || existingAppointment.endTime,
      id,
    );

    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .populate('customer')
      .populate('professional')
      .populate('schedule')
      .populate('services')
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return updatedAppointment;
  }

  async remove(id: string): Promise<Appointment> {
    const deletedAppointment = await this.appointmentModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return deletedAppointment;
  }

  async updateStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(
        id,
        { status: updateAppointmentStatusDto.status },
        { new: true },
      )
      .populate('customer')
      .populate('professional')
      .populate('schedule')
      .populate('services')
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return updatedAppointment;
  }

  async findByProfessional(professionalId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ professional: professionalId })
      .populate('customer')
      .populate('professional')
      .populate('schedule')
      .populate('services')
      .exec();
  }

  async checkAvailability(
    checkAvailabilityDto: CheckAvailabilityDto,
  ): Promise<CheckAvailabilityResponse> {
    const { professional, startDate, startTime, endDate, endTime, excludeId } =
      checkAvailabilityDto;

    const startDateOnly = startDate.split('T')[0];
    const endDateOnly = endDate.split('T')[0];

    const startDateTime = new Date(`${startDateOnly}T${startTime}`);
    const endDateTime = new Date(`${endDateOnly}T${endTime}`);

    if (startDateTime >= endDateTime) {
      throw new BadRequestException(
        'Start date/time must be before end date/time',
      );
    }

    const professionalExists =
      await this.professionalModel.findById(professional);
    if (!professionalExists) {
      throw new NotFoundException('Professional not found');
    }

    const allSchedules = await this.scheduleModel.find({
      professional: new Types.ObjectId(professional),
    });

    const startOfDay = new Date(startDateOnly);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDateOnly);
    endOfDay.setHours(23, 59, 59, 999);

    const schedules = await this.scheduleModel.find({
      professional: new Types.ObjectId(professional),
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    if (schedules.length === 0) {
      throw new BadRequestException(
        `No schedules found for the date ${startDateOnly}. Available schedules: ${allSchedules.map((s) => `${new Date(s.startDate).toISOString().split('T')[0]} (${s.startTime}-${s.endTime})`).join(', ')}`,
      );
    }

    const validSchedule = schedules.find((schedule) => {
      const scheduleStartTime = schedule.startTime.split(':').map(Number);
      const scheduleEndTime = schedule.endTime.split(':').map(Number);
      const requestStartTime = startTime.split(':').map(Number);
      const requestEndTime = endTime.split(':').map(Number);

      const scheduleStartMinutes =
        scheduleStartTime[0] * 60 + scheduleStartTime[1];
      const scheduleEndMinutes = scheduleEndTime[0] * 60 + scheduleEndTime[1];
      const requestStartMinutes =
        requestStartTime[0] * 60 + requestStartTime[1];
      const requestEndMinutes = requestEndTime[0] * 60 + requestEndTime[1];

      const isValid =
        requestStartMinutes >= scheduleStartMinutes &&
        requestEndMinutes <= scheduleEndMinutes;

      return isValid;
    });

    if (!validSchedule) {
      throw new BadRequestException(
        `Time slot (${startTime} to ${endTime}) is not within professional's available schedule hours (${schedules[0].startTime} to ${schedules[0].endTime})`,
      );
    }

    const query: any = {
      professional,
      status: { $ne: 'Cancelado' },
      $or: [
        {
          startDate: { $lte: startDateOnly },
          endDate: { $gte: startDateOnly },
          startTime: { $lte: startTime },
          endTime: { $gt: startTime },
        },
        {
          startDate: { $lte: endDateOnly },
          endDate: { $gte: endDateOnly },
          startTime: { $lt: endTime },
          endTime: { $gte: endTime },
        },
        {
          startDate: { $gte: startDateOnly },
          endDate: { $lte: endDateOnly },
        },
      ],
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const conflicts = await this.appointmentModel.find(query).exec();

    if (conflicts.length > 0) {
      return {
        available: false,
        conflicts: {
          appointments: conflicts.map((appointment: any) => ({
            _id: appointment._id.toString(),
            startDate: appointment.startDate,
            startTime: appointment.startTime,
            endDate: appointment.endDate,
            endTime: appointment.endTime,
            status: appointment.status,
          })),
        },
      };
    }

    return {
      available: true,
      scheduleId: (validSchedule as any)._id.toString(),
    };
  }
}
