import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './appointment.schema';
import {
  AccountReceivable,
  AccountReceivableSchema,
} from '../accounts-receivable/account-receivable.schema';
import {
  Professional,
  ProfessionalSchema,
} from '../professionals/professionals.schema';
import { Customer, CustomerSchema } from '../customers/customers.schema';
import { Service, ServiceSchema } from '../services/services.schema';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from '../payment-methods/payment-method.schema';
import { Schedule, ScheduleSchema } from '../schedules/schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: AccountReceivable.name, schema: AccountReceivableSchema },
      { name: Professional.name, schema: ProfessionalSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
