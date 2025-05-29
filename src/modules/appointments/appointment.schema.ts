import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { PaymentStatus } from './enums/payment-status.enum';

export type AppointmentDocument = Appointment & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Appointment {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', index: true, required: false })
  customerId?: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Professional',
    index: true,
  })
  professionalId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }], required: false })
  serviceIds?: Types.ObjectId[];

  @Prop({ required: true, type: String })
  startDate: string;

  @Prop({ required: true, type: String })
  startTime: string;

  @Prop({ required: true, type: String })
  endDate: string;

  @Prop({ required: true, type: String })
  endTime: string;

  @Prop({ required: false, default: 'America/Sao_Paulo' })
  timezone: string;

  @Prop({
    required: true,
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
    index: true,
  })
  status: AppointmentStatus;

  @Prop({ type: Number })
  amount?: number;

  @Prop({ type: Types.ObjectId, ref: 'PaymentMethod' })
  paymentMethodId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AccountReceivable', required: false })
  accountReceivableId?: Types.ObjectId;

  @Prop({ type: String, required: false, enum: PaymentStatus })
  paymentStatus?: PaymentStatus;

  accountReceivable?: any;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.index({ professionalId: 1, startDate: 1 });

AppointmentSchema.index({ customerId: 1, startDate: 1 });

AppointmentSchema.index({ status: 1, startDate: 1 });
