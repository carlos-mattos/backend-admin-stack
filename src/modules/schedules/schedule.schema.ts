import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Doctor', required: true })
  doctor: string;

  @Prop({ default: 'scheduled' })
  status: string;

  @Prop()
  notes?: string;

  @Prop({
    enum: ['none', 'daily', 'weekly', 'monthly', 'custom'],
    default: 'none',
  })
  recurrence: string;

  @Prop()
  repeatUntil?: Date;

  @Prop({ type: [String], default: [] })
  customRecurrenceDays?: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
