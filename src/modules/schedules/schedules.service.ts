import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from './schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

type EventData = Omit<CreateScheduleDto, 'status' | 'recurrence'> & {
  status: string;
  recurrence: string;
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

    const repeatUntil =
      enforcedRecurrence !== 'none' && createScheduleDto.repeatUntil
        ? new Date(createScheduleDto.repeatUntil)
        : null;

    const eventDuration = endDate.getTime() - startDate.getTime();

    if (!repeatUntil) {
      const createdSchedule = new this.scheduleModel({
        ...createScheduleDto,
        status: enforcedStatus,
        recurrence: enforcedRecurrence,
      });
      const savedDoc = await createdSchedule.save();
      return [savedDoc];
    }

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

      let currentDate = new Date(startDate);
      while (currentDate <= repeatUntil) {
        if (customDaysNumbers.includes(currentDate.getDay())) {
          const newStart = new Date(currentDate);
          newStart.setHours(
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds(),
          );
          const newEnd = new Date(newStart.getTime() + eventDuration);

          events.push({
            ...createScheduleDto,
            status: enforcedStatus,
            recurrence: enforcedRecurrence,
            startDate: newStart,
            endDate: newEnd,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      let currentStart = new Date(startDate);
      let currentEnd = new Date(endDate);

      while (currentStart <= repeatUntil) {
        events.push({
          ...createScheduleDto,
          status: enforcedStatus,
          recurrence: enforcedRecurrence,
          startDate: new Date(currentStart),
          endDate: new Date(currentEnd),
        });

        if (enforcedRecurrence === 'daily') {
          currentStart.setDate(currentStart.getDate() + 1);
          currentEnd.setDate(currentEnd.getDate() + 1);
        } else if (enforcedRecurrence === 'weekly') {
          currentStart.setDate(currentStart.getDate() + 7);
          currentEnd.setDate(currentEnd.getDate() + 7);
        } else if (enforcedRecurrence === 'monthly') {
          currentStart.setMonth(currentStart.getMonth() + 1);
          currentEnd.setMonth(currentEnd.getMonth() + 1);
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
}
