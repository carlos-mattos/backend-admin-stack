import { IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CashFlowQueryDto {
  @ApiProperty({
    description: 'Start date for the cash flow report (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date for the cash flow report (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
