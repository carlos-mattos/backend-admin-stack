import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './config/config.module';
import { PatientsModule } from './modules/patients/patients.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    PatientsModule,
  ],
})
export class AppModule {}
