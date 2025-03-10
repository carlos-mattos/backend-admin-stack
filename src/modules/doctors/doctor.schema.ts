import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Doctor {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  crm: string;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  documents: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Procedure' }],
    default: [],
  })
  proceduresHandled: string[];

  @Prop({ required: true })
  acceptsInsurance: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.virtual('schedules', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'doctor',
});
