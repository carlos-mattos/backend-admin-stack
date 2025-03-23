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

  @Prop({
    required: true,
    type: [String],
    set: (value: string | string[]): string[] => {
      if (typeof value === 'string') {
        return value.split(',').map((item) => item.trim());
      }
      return value;
    },
  })
  acceptedInsurances: string[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.virtual('schedules', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'doctor',
});
