import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Customer',
    required: false,
  })
  customer?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Professional',
    required: true,
  })
  professional: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  })
  schedule: string;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Service',
    required: false,
  })
  services?: string[];

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({
    type: String,
    enum: ['Bloqueio', 'Cancelado', 'Agendado', 'Pré-Agendado'],
    default: 'Agendado',
  })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Validação de horário
AppointmentSchema.pre('validate', function (next) {
  const start = new Date(`${this.startDate}T${this.startTime}`);
  const end = new Date(`${this.endDate}T${this.endTime}`);
  if (end <= start) {
    return next(
      new Error('endDate/endTime deve ser maior que startDate/startTime'),
    );
  }
  next();
});

// Índice único para prevenir sobreposição
AppointmentSchema.index(
  {
    schedule: 1,
    startDate: 1,
    startTime: 1,
    endDate: 1,
    endTime: 1,
    status: 1,
  },
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelado' } } },
);
