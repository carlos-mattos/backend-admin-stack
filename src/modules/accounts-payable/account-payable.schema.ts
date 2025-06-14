import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum RecurrencePeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export type AccountPayableDocument = AccountPayable & Document;

@Schema({ timestamps: true })
export class AccountPayable {
  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Date })
  dueDate: Date;

  @Prop({ required: true, type: String })
  vendor: string;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: true, type: String })
  category: string;

  @Prop({ required: true, type: Boolean })
  isRecurring: boolean;

  @Prop({ required: false, enum: RecurrencePeriod })
  recurrencePeriod?: RecurrencePeriod;
}

export const AccountPayableSchema =
  SchemaFactory.createForClass(AccountPayable);
