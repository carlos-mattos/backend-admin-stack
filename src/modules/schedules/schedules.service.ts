import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AppointmentsService } from '../appointments/appointments.service';
import { AppointmentStatus } from '../appointments/enums/appointment-status.enum';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import {
  RecurrenceType,
  Schedule,
  ScheduleDocument,
  ScheduleStatus,
} from './schedule.schema';

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
        ? updateData.startDate
        : baseSchedule.startDate,
      endDate: updateData?.endDate ? updateData.endDate : baseSchedule.endDate,
      startTime: updateData?.startTime ?? baseSchedule.startTime,
      endTime: updateData?.endTime ?? baseSchedule.endTime,
      timezone: updateData?.timezone ?? baseSchedule.timezone,
      status: updateData?.status ?? baseSchedule.status,
      recurrence: updateData?.recurrence ?? baseSchedule.recurrence,
      repeatUntil: updateData?.repeatUntil
        ? updateData.repeatUntil
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

    const startDate = createScheduleDto.startDate;
    const endDate = createScheduleDto.endDate;

    const seriesId = uuidv4();

    const repeatUntil =
      enforcedRecurrence !== RecurrenceType.NONE &&
      createScheduleDto.repeatUntil
        ? createScheduleDto.repeatUntil
        : null;

    if (!repeatUntil) {
      const singleEvent = new this.scheduleModel({
        ...createScheduleDto,
        status: enforcedStatus,
        recurrence: enforcedRecurrence,
        seriesId,
        professional: new Types.ObjectId(createScheduleDto.professional),
        startDate,
        endDate,
      });
      const savedDoc = await singleEvent.save();
      return [savedDoc];
    }

    const buildEvent = (currentDay: Date): EventData => {
      const dateStr = currentDay.toISOString().slice(0, 10);
      return {
        ...createScheduleDto,
        status: enforcedStatus,
        recurrence: enforcedRecurrence,
        seriesId,
        startDate: dateStr,
        endDate: dateStr,
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

      let cursor = new Date(startDate + 'T00:00:00');
      cursor.setHours(0, 0, 0, 0);
      const until = repeatUntil
        ? new Date(repeatUntil + 'T00:00:00')
        : new Date(startDate + 'T00:00:00');
      until.setHours(0, 0, 0, 0);

      while (cursor <= until) {
        if (customDaysNumbers.includes(cursor.getDay())) {
          events.push(buildEvent(cursor));
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    } else {
      let cursor = new Date(startDate + 'T00:00:00');
      cursor.setHours(0, 0, 0, 0);
      const until = repeatUntil
        ? new Date(repeatUntil + 'T00:00:00')
        : new Date(startDate + 'T00:00:00');
      until.setHours(0, 0, 0, 0);

      while (cursor <= until) {
        events.push(buildEvent(cursor));

        if (enforcedRecurrence === 'daily') {
          cursor.setDate(cursor.getDate() + 1);
        } else if (enforcedRecurrence === 'weekly') {
          cursor.setDate(cursor.getDate() + 7);
        } else if (enforcedRecurrence === 'monthly') {
          cursor.setMonth(cursor.getMonth() + 1);
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

    const appointments = await this.appointmentsService.findByProfessional(
      String(baseSchedule.professional),
    );
    const futureAppointments = appointments.filter((appointment) => {
      const baseStart = new Date(baseSchedule.startDate + 'T00:00:00');
      return (
        new Date(appointment.startDate) >= baseStart &&
        appointment.status !== AppointmentStatus.CANCELLED
      );
    });

    if (futureAppointments.length > 0) {
      throw new ConflictException(
        'Cannot update schedule with existing appointments',
      );
    }

    const query = {
      seriesId: baseSchedule.seriesId,
      professional: baseSchedule.professional,
    };

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

    const appointments = await this.appointmentsService.findByProfessional(
      String(baseSchedule.professional),
    );
    const futureAppointments = appointments.filter((appointment) => {
      const baseStart = new Date(baseSchedule.startDate + 'T00:00:00');
      return (
        new Date(appointment.startDate) >= baseStart &&
        appointment.status !== AppointmentStatus.CANCELLED
      );
    });

    if (futureAppointments.length > 0) {
      throw new ConflictException(
        'Cannot delete schedule with existing appointments',
      );
    }

    await this.scheduleModel.findByIdAndDelete(id).exec();

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
      query.startDate = { $gte: filters.startDate };
    }

    if (filters?.endDate) {
      query.endDate = { $lte: filters.endDate };
    }

    return this.scheduleModel
      .find(query)
      .populate('professional')
      .sort({ startDate: 1, startTime: 1 })
      .exec();
  }
}
