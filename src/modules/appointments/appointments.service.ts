import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountReceivable } from '../accounts-receivable/account-receivable.schema';
import { AccountReceivableStatus } from '../accounts-receivable/enums/account-receivable-status.enum';
import { Customer, CustomerDocument } from '../customers/customers.schema';
import {
  Professional,
  ProfessionalDocument,
} from '../professionals/professionals.schema';
import { Schedule, ScheduleDocument } from '../schedules/schedule.schema';
import { Service, ServiceDocument } from '../services/services.schema';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { UpdateAppointmentStatusDto } from './dto/confirm-appointment.dto';
import { CreateAppointmentFinanceDto } from './dto/create-appointment-finance.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { CheckAvailabilityResponse } from './interfaces/check-availability.interface';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Schedule.name)
    private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Professional.name)
    private professionalModel: Model<ProfessionalDocument>,
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
    @InjectModel(Service.name)
    private serviceModel: Model<ServiceDocument>,
    @InjectModel(AccountReceivable.name)
    private accountReceivableModel: Model<AccountReceivable>,
  ) {}

  private convertToDate(
    dateStr: string,
    timeStr: string,
    _timezone?: string,
  ): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    await this.validateAppointment(createAppointmentDto);

    await this.checkAvailability(
      {
        professional: createAppointmentDto.professional,
        startDate: createAppointmentDto.startDate,
        startTime: createAppointmentDto.startTime,
        endDate: createAppointmentDto.endDate,
        endTime: createAppointmentDto.endTime,
        timezone: createAppointmentDto.timezone,
        excludeId: undefined,
      },
      true,
    );

    const createdAppointment = new this.appointmentModel({
      title: createAppointmentDto.title,
      description: createAppointmentDto.description,
      professionalId: new Types.ObjectId(createAppointmentDto.professional),
      startDate: createAppointmentDto.startDate,
      startTime: createAppointmentDto.startTime,
      endDate: createAppointmentDto.endDate,
      endTime: createAppointmentDto.endTime,
      timezone: createAppointmentDto.timezone,
      status: createAppointmentDto.status,
      amount: createAppointmentDto.amount,
      paymentMethodId: createAppointmentDto.paymentMethodId
        ? new Types.ObjectId(createAppointmentDto.paymentMethodId)
        : undefined,
    });

    return createdAppointment.save();
  }

  async createWithFinance(
    createAppointmentFinanceDto: CreateAppointmentFinanceDto,
  ): Promise<Appointment> {
    await this.validateAppointment(createAppointmentFinanceDto);

    await this.checkAvailability(
      {
        professional: createAppointmentFinanceDto.professional,
        startDate: createAppointmentFinanceDto.startDate,
        startTime: createAppointmentFinanceDto.startTime,
        endDate: createAppointmentFinanceDto.endDate,
        endTime: createAppointmentFinanceDto.endTime,
        timezone: createAppointmentFinanceDto.timezone,
        excludeId: undefined,
      },
      true,
    );

    const createdAppointment = new this.appointmentModel({
      title: createAppointmentFinanceDto.title,
      description: createAppointmentFinanceDto.description,
      customerId: new Types.ObjectId(createAppointmentFinanceDto.customer),
      professionalId: new Types.ObjectId(
        createAppointmentFinanceDto.professional,
      ),
      serviceIds: createAppointmentFinanceDto.services.map(
        (id) => new Types.ObjectId(id),
      ),
      startDate: createAppointmentFinanceDto.startDate,
      startTime: createAppointmentFinanceDto.startTime,
      endDate: createAppointmentFinanceDto.endDate,
      endTime: createAppointmentFinanceDto.endTime,
      timezone: createAppointmentFinanceDto.timezone,
      status: AppointmentStatus.SCHEDULED,
      amount: createAppointmentFinanceDto.amount,
      paymentMethodId: createAppointmentFinanceDto.paymentMethodId
        ? new Types.ObjectId(createAppointmentFinanceDto.paymentMethodId)
        : undefined,
    });

    const savedAppointment = await createdAppointment.save();

    const accountReceivable = new this.accountReceivableModel({
      amount: createAppointmentFinanceDto.amount,
      customerId: new Types.ObjectId(createAppointmentFinanceDto.customer),
      status: AccountReceivableStatus.PENDING,
      appointmentId: savedAppointment._id,
    });

    await accountReceivable.save();

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('customerId')
      .populate('professionalId')
      .populate('serviceIds')
      .exec();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(new Types.ObjectId(id))
      .populate('customerId')
      .populate('professionalId')
      .populate('serviceIds')
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
    const updateData: any = {};
    if (typeof updateAppointmentDto.title !== 'undefined') {
      updateData.title = updateAppointmentDto.title;
    }
    if (typeof updateAppointmentDto.description !== 'undefined') {
      updateData.description = updateAppointmentDto.description;
    }
    if (typeof updateAppointmentDto.paymentStatus !== 'undefined') {
      updateData.paymentStatus = updateAppointmentDto.paymentStatus;
    }

    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('customerId')
      .populate('professionalId')
      .populate('serviceIds')
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
      .populate('customerId')
      .populate('professionalId')
      .populate('serviceIds')
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return updatedAppointment;
  }

  async findByProfessional(professionalId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ professionalId: new Types.ObjectId(professionalId) })
      .populate('customerId')
      .populate('professionalId')
      .populate('serviceIds')
      .exec();
  }

  async checkAvailability(
    checkAvailabilityDto: CheckAvailabilityDto,
    throwOnUnavailable = false,
  ): Promise<CheckAvailabilityResponse> {
    const {
      professional,
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
      excludeId,
    } = checkAvailabilityDto;

    const professionalExists = await this.professionalModel.findById(
      new Types.ObjectId(professional),
    );

    if (!professionalExists) {
      if (throwOnUnavailable)
        throw new NotFoundException('Professional not found');
      return {
        available: false,
        conflicts: { appointments: [] },
        message: 'Professional not found',
      };
    }

    const appointmentStart = this.convertToDate(startDate, startTime, timezone);
    const appointmentEnd = this.convertToDate(endDate, endTime, timezone);

    const coveringSchedule = await this.scheduleModel.findOne({
      professional: new Types.ObjectId(professional),
      status: 'scheduled',
      startDate: { $lte: startDate },
      endDate: { $gte: endDate },
      startTime: { $lte: startTime },
      endTime: { $gte: endTime },
    });

    if (!coveringSchedule) {
      if (throwOnUnavailable)
        throw new BadRequestException(
          'O profissional não possui agenda para o horário solicitado.',
        );
      return {
        available: false,
        conflicts: { appointments: [] },
        nextAvailableSlot: undefined,
        message: 'O profissional não possui agenda para o horário solicitado.',
      };
    }

    const conflicts = await this.appointmentModel
      .find({
        professionalId: new Types.ObjectId(professional),
        status: { $ne: AppointmentStatus.CANCELLED },
        startDate: startDate,
        endDate: endDate,
        ...(excludeId && { _id: { $ne: new Types.ObjectId(excludeId) } }),
      })
      .lean();

    function intervalsOverlap(
      startA: string,
      endA: string,
      startB: string,
      endB: string,
    ) {
      return startA < endB && endA > startB;
    }

    const overlapping = conflicts.filter((app) =>
      intervalsOverlap(app.startTime, app.endTime, startTime, endTime),
    );

    if (overlapping.length > 0) {
      const searchEnd = new Date(appointmentStart);
      searchEnd.setDate(searchEnd.getDate() + 30);

      const schedules = await this.scheduleModel
        .find({
          professional: new Types.ObjectId(professional),
          startDate: {
            $gte: startDate,
            $lte: searchEnd.toISOString().slice(0, 10),
          },
          status: 'scheduled',
        })
        .sort({ startDate: 1 })
        .lean();

      const appointments = await this.appointmentModel
        .find({
          professionalId: new Types.ObjectId(professional),
          status: { $ne: AppointmentStatus.CANCELLED },
          startDate: {
            $gte: startDate,
            $lte: searchEnd.toISOString().slice(0, 10),
          },
        })
        .sort({ startDate: 1 })
        .lean();

      let nextAvailableSlot:
        | {
            startDate: string;
            startTime: string;
            endDate: string;
            endTime: string;
          }
        | undefined = undefined;
      const durationMs = appointmentEnd.getTime() - appointmentStart.getTime();

      for (const schedule of schedules) {
        let freeSlots: { start: Date; end: Date }[] = [
          {
            start: new Date(
              schedule.startDate + 'T' + schedule.startTime + ':00',
            ),
            end: new Date(schedule.endDate + 'T' + schedule.endTime + ':00'),
          },
        ];

        const scheduleAppointments = appointments.filter(
          (app) =>
            app.startDate === schedule.startDate &&
            app.endDate === schedule.endDate &&
            intervalsOverlap(
              app.startTime,
              app.endTime,
              schedule.startTime,
              schedule.endTime,
            ),
        );

        for (const app of scheduleAppointments) {
          const appStart = new Date(
            app.startDate + 'T' + app.startTime + ':00',
          );
          const appEnd = new Date(app.endDate + 'T' + app.endTime + ':00');
          freeSlots = freeSlots.flatMap((slot) => {
            if (appEnd <= slot.start || appStart >= slot.end) {
              return [slot];
            }
            const slots: { start: Date; end: Date }[] = [];
            if (appStart > slot.start) {
              slots.push({ start: slot.start, end: appStart });
            }
            if (appEnd < slot.end) {
              slots.push({ start: appEnd, end: slot.end });
            }
            return slots;
          });
        }

        freeSlots = freeSlots.filter(
          (slot) => slot.end.getTime() - slot.start.getTime() >= durationMs,
        );
        freeSlots.sort(
          (a, b) =>
            Math.abs(a.start.getTime() - appointmentStart.getTime()) -
            Math.abs(b.start.getTime() - appointmentStart.getTime()),
        );

        if (freeSlots.length > 0) {
          const found = freeSlots[0];
          const slotStart = new Date(found.start);
          const slotEnd = new Date(found.start.getTime() + durationMs);
          nextAvailableSlot = {
            startDate: slotStart.toISOString().slice(0, 10),
            startTime: slotStart.toTimeString().slice(0, 5),
            endDate: slotEnd.toISOString().slice(0, 10),
            endTime: slotEnd.toTimeString().slice(0, 5),
          };

          break;
        }
      }

      if (throwOnUnavailable)
        throw new BadRequestException(
          'Professional is not available at this time',
        );

      return {
        available: false,
        conflicts: {
          appointments: overlapping.map((appointment) => ({
            _id: appointment._id.toString(),
            startDate: appointment.startDate,
            endDate: appointment.endDate,
            status: appointment.status,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
          })),
        },
        nextAvailableSlot,
      };
    }

    return { available: true };
  }

  private async validateAppointment(
    dto: CreateAppointmentDto | CreateAppointmentFinanceDto,
  ): Promise<void> {
    const professional = await this.professionalModel
      .findById(new Types.ObjectId(dto.professional))
      .exec();
    if (!professional) {
      throw new NotFoundException(
        `Professional with ID ${dto.professional} not found`,
      );
    }

    if ('customer' in dto && dto.customer) {
      const customer = await this.customerModel
        .findById(new Types.ObjectId(dto.customer))
        .exec();

      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${dto.customer} not found`,
        );
      }
    }

    if ('services' in dto && dto.services) {
      for (const serviceId of dto.services) {
        const service = await this.serviceModel.findById(serviceId).exec();
        if (!service) {
          throw new NotFoundException(`Service with ID ${serviceId} not found`);
        }
      }
    }
  }
}
