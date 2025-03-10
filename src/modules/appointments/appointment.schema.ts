import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Patient', required: true })
  patient: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Doctor', required: true })
  doctor: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Procedure',
    required: true,
  })
  procedure: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ default: false })
  confirmed: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
