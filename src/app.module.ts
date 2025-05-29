import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { ServicesModule } from './modules/services/services.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AccountsReceivableModule } from './modules/accounts-receivable/accounts-receivable.module';
import { AccountsPayableModule } from './modules/accounts-payable/accounts-payable.module';
import { CashFlowModule } from './modules/cash-flow/cash-flow.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CustomersModule,
    ProfessionalsModule,
    ServicesModule,
    SchedulesModule,
    AppointmentsModule,
    AccountsReceivableModule,
    AccountsPayableModule,
    CashFlowModule,
    PaymentMethodsModule,
  ],
})
export class AppModule {}
