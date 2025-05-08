import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum ScheduleStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Schedule extends Document {
  @ApiProperty({
    description: 'Professional ID',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: Types.ObjectId, ref: 'Professional', required: true })
  professional: Types.ObjectId;

  @ApiProperty({
    description: 'Start date of the schedule',
    example: '2024-03-20T09:00:00Z',
  })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the schedule',
    example: '2024-03-20T17:00:00Z',
  })
  @Prop({ required: true })
  endDate: Date;

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '09:00',
  })
  @Prop({ required: true })
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:mm format',
    example: '17:00',
  })
  @Prop({ required: true })
  endTime: string;

  @ApiProperty({
    description: 'Timezone of the schedule',
    example: 'America/Sao_Paulo',
  })
  @Prop({ required: true })
  timezone: string;

  @ApiProperty({
    description: 'Status of the schedule',
    enum: ScheduleStatus,
    example: ScheduleStatus.SCHEDULED,
  })
  @Prop({
    required: true,
    enum: ScheduleStatus,
    default: ScheduleStatus.SCHEDULED,
  })
  status: ScheduleStatus;

  @ApiProperty({
    description: 'Recurrence type',
    enum: RecurrenceType,
    example: RecurrenceType.NONE,
  })
  @Prop({ required: true, enum: RecurrenceType, default: RecurrenceType.NONE })
  recurrence: RecurrenceType;

  @ApiProperty({
    description: 'Date until which the schedule repeats',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @Prop()
  repeatUntil?: Date;

  @ApiProperty({
    description: 'Custom recurrence days',
    example: ['monday', 'wednesday', 'friday'],
    required: false,
  })
  @Prop()
  customRecurrenceDays?: string[];

  @ApiProperty({
    description: 'Unique identifier for the series of recurring events',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Prop({ required: true })
  seriesId: string;

  @ApiProperty({
    description: 'Day of the week',
    example: 'Monday',
    readOnly: true,
  })
  dayOfWeek: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

// Adiciona o virtual field para o dia da semana
ScheduleSchema.virtual('dayOfWeek').get(function () {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  // Ajusta a data para o fuso horário correto
  const date = new Date(this.startDate);
  const timezoneOffset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + timezoneOffset);
  return days[date.getDay()];
});

export type ScheduleDocument = Schedule & Document;
