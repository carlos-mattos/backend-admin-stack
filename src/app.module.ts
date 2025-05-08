import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './config/config.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { ServicesModule } from './modules/services/services.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    CustomersModule,
    ProfessionalsModule,
    ServicesModule,
    SchedulesModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
