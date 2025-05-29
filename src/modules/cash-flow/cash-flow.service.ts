import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AccountReceivable,
  AccountReceivableDocument,
} from '../accounts-receivable/account-receivable.schema';
import {
  AccountPayable,
  AccountPayableDocument,
} from '../accounts-payable/account-payable.schema';
import { CashFlowReportDto } from './dto/cash-flow-report.dto';

@Injectable()
export class CashFlowService {
  constructor(
    @InjectModel(AccountReceivable.name)
    private accountReceivableModel: Model<AccountReceivableDocument>,
    @InjectModel(AccountPayable.name)
    private accountPayableModel: Model<AccountPayableDocument>,
  ) {}

  async getReport(start: Date, end: Date): Promise<CashFlowReportDto> {
    const [receivables, payables] = await Promise.all([
      this.accountReceivableModel
        .aggregate([
          {
            $match: {
              dueDate: { $gte: start, $lte: end },
              status: 'PAID',
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ])
        .exec(),
      this.accountPayableModel
        .aggregate([
          {
            $match: {
              dueDate: { $gte: start, $lte: end },
              status: 'PAID',
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ])
        .exec(),
    ]);

    const totalIn = receivables[0]?.total || 0;
    const totalOut = payables[0]?.total || 0;

    return {
      totalIn,
      totalOut,
      netBalance: totalIn - totalOut,
    };
  }
}
