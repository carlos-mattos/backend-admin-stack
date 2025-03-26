import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule, ScheduleDocument } from './schedule.schema';

type EventData = Omit<CreateScheduleDto, 'status' | 'recurrence'> & {
  status: string;
  recurrence: string;
  seriesId: string;
};

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
  ) {}

  async create(
    createScheduleDto: CreateScheduleDto,
  ): Promise<ScheduleDocument[]> {
    const enforcedStatus = createScheduleDto.status ?? 'scheduled';
    const enforcedRecurrence = createScheduleDto.recurrence ?? 'none';

    const startDate = new Date(createScheduleDto.startDate);
    const endDate = new Date(createScheduleDto.endDate);

    const seriesId = uuidv4();

    const repeatUntil =
      enforcedRecurrence !== 'none' && createScheduleDto.repeatUntil
        ? new Date(createScheduleDto.repeatUntil)
        : null;

    if (!repeatUntil) {
      const singleEvent = new this.scheduleModel({
        ...createScheduleDto,
        status: enforcedStatus,
        recurrence: enforcedRecurrence,
        seriesId,
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
    return this.scheduleModel.find().populate('doctor').exec();
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel
      .findById(id)
      .populate('doctor')
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
    const updatedSchedule = await this.scheduleModel
      .findByIdAndUpdate(id, updateScheduleDto, { new: true })
      .populate('doctor')
      .exec();

    if (!updatedSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return updatedSchedule;
  }

  async remove(id: string): Promise<Schedule> {
    const deletedSchedule = await this.scheduleModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return deletedSchedule;
  }

  async removeFutureEvents(
    doctorId: string,
    scheduleId: string,
  ): Promise<number> {
    const baseSchedule = await this.scheduleModel.findById(scheduleId).exec();
    if (!baseSchedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    if (String(baseSchedule.doctor) !== doctorId) {
      throw new NotFoundException(
        `Schedule with ID ${scheduleId} not found for doctor ${doctorId}`,
      );
    }

    const query = {
      seriesId: baseSchedule.seriesId,
      doctor: doctorId,
      startDate: { $gte: baseSchedule.startDate },
    };

    const result = await this.scheduleModel.deleteMany(query).exec();
    return result.deletedCount ?? 0;
  }

  async updateFutureEvents(
    doctorId: string,
    scheduleId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<number> {
    const baseSchedule = await this.scheduleModel.findById(scheduleId).exec();
    if (!baseSchedule) {
      throw new NotFoundException(`Schedule with ID ${scheduleId} not found`);
    }

    if (String(baseSchedule.doctor) !== doctorId) {
      throw new NotFoundException(
        `Schedule with ID ${scheduleId} not found for doctor ${doctorId}`,
      );
    }

    const query = {
      seriesId: baseSchedule.seriesId,
      doctor: doctorId,
      startDate: { $gte: baseSchedule.startDate },
    };

    const result = await this.scheduleModel.updateMany(
      query,
      updateScheduleDto,
    );
    return result.modifiedCount ?? 0;
  }
}
