import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentMethodDocument = PaymentMethod & Document;

@Schema({ timestamps: true })
export class PaymentMethod {
  @Prop({ required: true, type: String, unique: true })
  name: string;

  @Prop({ required: true, type: Boolean, default: true })
  isActive: boolean;

  @Prop({ required: true, type: Number, default: 0 })
  displayOrder: number;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod); 