import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentMethodDocument = PaymentMethod & Document;

@Schema({ timestamps: true })
export class PaymentMethod {
  @Prop({ required: true, type: String, unique: true })
  name: string;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod); 