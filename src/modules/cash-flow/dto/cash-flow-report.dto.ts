import { ApiProperty } from '@nestjs/swagger';

export class CashFlowMonthlyDto {
  @ApiProperty({ description: 'Month in YYYY-MM format', example: '2024-03' })
  month: string;

  @ApiProperty({ description: 'Total income for the month', example: 2000 })
  inflow: number;

  @ApiProperty({ description: 'Total expenses for the month', example: 1500 })
  outflow: number;

  @ApiProperty({ description: 'Net balance for the month (inflow - outflow)', example: 500 })
  balance: number;
}

export class CashFlowSummaryDto {
  @ApiProperty({ description: 'Total inflow for the period', example: 6000 })
  totalInflow: number;

  @ApiProperty({ description: 'Total outflow for the period', example: 3000 })
  totalOutflow: number;

  @ApiProperty({ description: 'Net balance for the period', example: 3000 })
  netBalance: number;
}

export class CashFlowReportDto {
  @ApiProperty({ type: CashFlowSummaryDto })
  summary: CashFlowSummaryDto;

  @ApiProperty({ type: [CashFlowMonthlyDto] })
  monthly: CashFlowMonthlyDto[];
}
