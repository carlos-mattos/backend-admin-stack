import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProcedureDocument = Procedure & Document;

@Schema({ timestamps: true })
export class Procedure {
  @Prop({ required: true })
  procedureName: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  acceptsInsurance: boolean;

  @Prop({ required: true })
  nextContactDays: number;
}

export const ProcedureSchema = SchemaFactory.createForClass(Procedure);
