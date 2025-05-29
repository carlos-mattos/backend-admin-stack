import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CashFlowService } from './cash-flow.service';
import { CashFlowQueryDto } from './dto/cash-flow-query.dto';
import { CashFlowReportDto } from './dto/cash-flow-report.dto';

@ApiTags('cash-flow')
@Controller('cash-flow-report')
export class CashFlowController {
  constructor(private readonly cashFlowService: CashFlowService) {}

  @Get()
  @ApiOperation({ summary: 'Get cash flow report for a date range (monthly breakdown and summary)' })
  @ApiQuery({ name: 'startDate', type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', type: String, example: '2024-12-31' })
  @ApiResponse({
    status: 200,
    description: 'Returns the cash flow report with monthly breakdown and summary',
    type: CashFlowReportDto,
  })
  async getReport(@Query() query: CashFlowQueryDto): Promise<CashFlowReportDto> {
    const start = new Date(query.startDate);
    const end = new Date(query.endDate);
    return this.cashFlowService.getReport(start, end);
  }
} 