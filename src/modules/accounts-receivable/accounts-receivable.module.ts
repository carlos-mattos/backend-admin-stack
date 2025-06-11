import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsReceivableService } from './accounts-receivable.service';
import { AccountsReceivableController } from './accounts-receivable.controller';
import { AccountReceivable, AccountReceivableSchema } from './account-receivable.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountReceivable.name, schema: AccountReceivableSchema }
    ])
  ],
  controllers: [AccountsReceivableController],
  providers: [AccountsReceivableService],
  exports: [AccountsReceivableService],
})
export class AccountsReceivableModule {} 