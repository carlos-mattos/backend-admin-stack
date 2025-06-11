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
import {
  CashFlowReportDto,
  CashFlowMonthlyDto,
  CashFlowSummaryDto,
} from './dto/cash-flow-report.dto';

@Injectable()
export class CashFlowService {
  constructor(
    @InjectModel(AccountReceivable.name)
    private accountReceivableModel: Model<AccountReceivableDocument>,
    @InjectModel(AccountPayable.name)
    private accountPayableModel: Model<AccountPayableDocument>,
  ) {}

  async getReport(start: Date, end: Date): Promise<CashFlowReportDto> {
    const receivables = await this.accountReceivableModel
      .aggregate([
        {
          $match: {
            dueDate: { $gte: start, $lte: end },
            status: 'PAID',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$dueDate' } },
            inflow: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

    const payables = await this.accountPayableModel
      .aggregate([
        {
          $match: {
            dueDate: { $gte: start, $lte: end },
            status: 'PAID',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$dueDate' } },
            outflow: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

    const monthSet = new Set<string>();
    receivables.forEach((r) => monthSet.add(r._id));
    payables.forEach((p) => monthSet.add(p._id));
    const months = Array.from(monthSet).sort();

    const monthly: CashFlowMonthlyDto[] = months.map((month) => {
      const inflow = receivables.find((r) => r._id === month)?.inflow || 0;
      const outflow = payables.find((p) => p._id === month)?.outflow || 0;
      return {
        month,
        inflow,
        outflow,
        balance: inflow - outflow,
      };
    });

    const totalInflow = monthly.reduce((sum, m) => sum + m.inflow, 0);
    const totalOutflow = monthly.reduce((sum, m) => sum + m.outflow, 0);
    const netBalance = totalInflow - totalOutflow;

    const summary: CashFlowSummaryDto = {
      totalInflow,
      totalOutflow,
      netBalance,
    };

    return {
      summary,
      monthly,
    };
  }
}
