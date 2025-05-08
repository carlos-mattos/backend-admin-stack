import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {
  Schedule,
  ScheduleDocument,
  ScheduleStatus,
  RecurrenceType,
} from './schedule.schema';
import { AppointmentsService } from '../appointments/appointments.service';

type EventData = Omit<
  CreateScheduleDto,
  'status' | 'recurrence' | 'professional'
> & {
  status: ScheduleStatus;
  recurrence: RecurrenceType;
  seriesId: string;
  professional: Types.ObjectId;
};

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
  ) {}

  private async recreateScheduleSeries(
    baseSchedule: ScheduleDocument,
    updateData?: Partial<CreateScheduleDto>,
  ): Promise<ScheduleDocument[]> {
    const newScheduleData: CreateScheduleDto = {
      professional: String(baseSchedule.professional),
      startDate: updateData?.startDate
        ? new Date(updateData.startDate)
        : baseSchedule.startDate,
      endDate: updateData?.endDate
        ? new Date(updateData.endDate)
        : baseSchedule.endDate,
      startTime: updateData?.startTime ?? baseSchedule.startTime,
      endTime: updateData?.endTime ?? baseSchedule.endTime,
      timezone: updateData?.timezone ?? baseSchedule.timezone,
      status: updateData?.status ?? baseSchedule.status,
      recurrence: updateData?.recurrence ?? baseSchedule.recurrence,
      repeatUntil: updateData?.repeatUntil
        ? new Date(updateData.repeatUntil)
        : baseSchedule.repeatUntil,
      customRecurrenceDays:
        updateData?.customRecurrenceDays ?? baseSchedule.customRecurrenceDays,
    };

    return this.create(newScheduleData);
  }

  async create(
    createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleDocument[]> {
    const enforcedStatus = createScheduleDto.status ?? ScheduleStatus.SCHEDULED;
    const enforcedRecurrence =
      createScheduleDto.recurrence ?? RecurrenceType.NONE;

    const startDate = new Date(createScheduleDto.startDate);
    const endDate = new Date(createScheduleDto.endDate);

    const seriesId = uuidv4();

    const repeatUntil =
      enforcedRecurrence !== RecurrenceType.NONE &&
      createScheduleDto.repeatUntil
        ? new Date(createScheduleDto.repeatUntil)
        : null;

    if (!repeatUntil) {
      const singleEvent = new this.scheduleModel({
        ...createScheduleDto,
        status: enforcedStatus,
        recurrence: enforcedRecurrence,
        seriesId,
        professional: new Types.ObjectId(createScheduleDto.professional),
      });
      const savedDoc = await singleEvent.save();
      return [savedDoc];
    }

    const buildEvent = (currentDay: Date): EventData => {
      const newStart = new Date(currentDay);
      newStart.setHours(
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds(),
        0,
      );

      const newEnd = new Date(currentDay);
      newEnd.setHours(
        endDate.getHours(),
        endDate.getMinutes(),
        endDate.getSeconds(),
        0,
      );

      return {
        ...createScheduleDto,
        status: enforcedStatus,
        recurrence: enforcedRecurrence,
        seriesId,
        startDate: newStart,
        endDate: newEnd,
        professional: new Types.ObjectId(createScheduleDto.professional),
      };
    };

    const events: EventData[] = [];

    if (
      enforcedRecurrence === 'custom' &&
      createScheduleDto.customRecurrenceDays?.length
    ) {
      const dayMapping: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };

      const customDaysNumbers = createScheduleDto.customRecurrenceDays.map(
        (day) => dayMapping[day.toLowerCase()],
      );

      let currentDay = new Date(startDate);

      while (currentDay <= repeatUntil) {
        if (customDaysNumbers.includes(currentDay.getDay())) {
          events.push(buildEvent(currentDay));
        }
        currentDay.setDate(currentDay.getDate() + 1);
      }
    } else {
      let currentDay = new Date(startDate);

      while (currentDay <= repeatUntil) {
        events.push(buildEvent(currentDay));

        if (enforcedRecurrence === 'daily') {
          currentDay.setDate(currentDay.getDate() + 1);
        } else if (enforcedRecurrence === 'weekly') {
          currentDay.setDate(currentDay.getDate() + 7);
        } else if (enforcedRecurrence === 'monthly') {
          currentDay.setMonth(currentDay.getMonth() + 1);
        } else {
          break;
        }
      }
    }

    return this.scheduleModel.insertMany(events);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleModel.find().populate('professional').exec();
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel
      .findById(id)
      .populate('professional')
      .exec();
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const baseSchedule = await this.scheduleModel.findById(id).exec();
    if (!baseSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    // Check for existing appointments
    const appointments = await this.appointmentsService.findByProfessional(
      String(baseSchedule.professional),
    );
    const futureAppointments = appointments.filter(
      (appointment) =>
        new Date(appointment.startDate) >= baseSchedule.startDate &&
        appointment.status !== 'cancelled',
    );

    if (futureAppointments.length > 0) {
      throw new ConflictException(
        'Cannot update schedule with existing appointments',
      );
    }

    // Delete all schedules in the series
    const query = {
      seriesId: baseSchedule.seriesId,
      professional: baseSchedule.professional,
    };

    const deleteResult = await this.scheduleModel.deleteMany(query).exec();

    // Create new series of schedules
    const newSchedules = await this.recreateScheduleSeries(
      baseSchedule,
      updateScheduleDto,
    );

    return newSchedules[0] as Schedule;
  }

  async remove(id: string): Promise<Schedule> {
    const baseSchedule = await this.scheduleModel.findById(id).exec();
    if (!baseSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    // Check for existing appointments
    const appointments = await this.appointmentsService.findByProfessional(
      String(baseSchedule.professional),
    );
    const futureAppointments = appointments.filter(
      (appointment) =>
        new Date(appointment.startDate) >= baseSchedule.startDate &&
        appointment.status !== 'cancelled',
    );

    if (futureAppointments.length > 0) {
      throw new ConflictException(
        'Cannot delete schedule with existing appointments',
      );
    }

    // Delete all schedules in the series
    const query = {
      seriesId: baseSchedule.seriesId,
      professional: baseSchedule.professional,
    };
    await this.scheduleModel.deleteMany(query).exec();

    return baseSchedule;
  }

  async findByProfessional(
    professionalId: string,
    filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<Schedule[]> {
    const query: any = { professional: new Types.ObjectId(professionalId) };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.startDate) {
      query.startDate = { $gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      query.endDate = { $lte: new Date(filters.endDate) };
    }

    return this.scheduleModel
      .find(query)
      .populate('professional')
      .sort({ startDate: 1, startTime: 1 })
      .exec();
  }
}
