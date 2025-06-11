import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashFlowService } from './cash-flow.service';
import { CashFlowController } from './cash-flow.controller';
import {
  AccountReceivable,
  AccountReceivableSchema,
} from '../accounts-receivable/account-receivable.schema';
import {
  AccountPayable,
  AccountPayableSchema,
} from '../accounts-payable/account-payable.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountReceivable.name, schema: AccountReceivableSchema },
      { name: AccountPayable.name, schema: AccountPayableSchema },
    ]),
  ],
  controllers: [CashFlowController],
  providers: [CashFlowService],
  exports: [CashFlowService],
})
export class CashFlowModule {}
