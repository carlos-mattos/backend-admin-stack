import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  documents: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  communicationConsent: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
