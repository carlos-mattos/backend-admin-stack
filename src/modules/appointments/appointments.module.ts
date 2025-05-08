import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './appointment.schema';
import { Schedule, ScheduleSchema } from '../schedules/schedule.schema';
import {
  Professional,
  ProfessionalSchema,
} from '../professionals/professionals.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Professional.name, schema: ProfessionalSchema },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
