import { ApiProperty } from '@nestjs/swagger';

export class CashFlowReportDto {
  @ApiProperty({
    description: 'Total amount of money received (accounts receivable)',
    example: 15000.5,
  })
  totalIn: number;

  @ApiProperty({
    description: 'Total amount of money paid (accounts payable)',
    example: 8500.25,
  })
  totalOut: number;

  @ApiProperty({
    description: 'Net balance (totalIn - totalOut)',
    example: 6500.25,
  })
  netBalance: number;
}
