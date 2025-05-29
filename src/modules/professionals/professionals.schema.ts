import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Service } from '../services/services.schema';

export type ProfessionalDocument = Professional & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Professional {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  crm: string;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  documents: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Service' }],
    default: [],
  })
  serviceHandled: Service[];
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);

ProfessionalSchema.virtual('schedules', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'professional',
});
