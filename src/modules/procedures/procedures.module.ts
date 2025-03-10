import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProceduresService } from './procedures.service';
import { ProceduresController } from './procedures.controller';
import { Procedure, ProcedureSchema } from './procedure.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Procedure.name, schema: ProcedureSchema },
    ]),
  ],
  controllers: [ProceduresController],
  providers: [ProceduresService],
})
export class ProceduresModule {}
