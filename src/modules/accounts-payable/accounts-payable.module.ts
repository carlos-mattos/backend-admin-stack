import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsPayableService } from './accounts-payable.service';
import { AccountsPayableController } from './accounts-payable.controller';
import {
  AccountPayable,
  AccountPayableSchema,
} from './account-payable.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountPayable.name, schema: AccountPayableSchema },
    ]),
  ],
  controllers: [AccountsPayableController],
  providers: [AccountsPayableService],
  exports: [AccountsPayableService],
})
export class AccountsPayableModule {}
