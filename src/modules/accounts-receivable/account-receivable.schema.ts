import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export type AccountReceivableDocument = AccountReceivable & Document;

@Schema({ timestamps: true })
export class AccountReceivable {
  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: false, type: Date })
  dueDate?: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'PaymentMethod' })
  paymentMethodId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Appointment' })
  appointmentId?: Types.ObjectId;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;
}

export const AccountReceivableSchema =
  SchemaFactory.createForClass(AccountReceivable);
