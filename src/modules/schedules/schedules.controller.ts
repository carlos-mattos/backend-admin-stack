import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schedule.schema';
import { SchedulesService } from './schedules.service';

@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new schedule with recurrence support' })
  @ApiResponse({
    status: 201,
    description: 'Schedule(s) created successfully.',
    type: [Schedule],
  })
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all schedules' })
  @ApiResponse({
    status: 200,
    description: 'List of schedules retrieved successfully.',
  })
  async findAll() {
    return this.schedulesService.findAll();
  }

  @Get('professional/:professionalId')
  @ApiOperation({ summary: 'Get schedules by professional' })
  @ApiResponse({
    status: 200,
    description: 'Return all schedules for the specified professional.',
    type: [Schedule],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['scheduled', 'cancelled', 'completed'],
    description: 'Filter schedules by status',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter schedules starting from this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter schedules ending before this date (YYYY-MM-DD)',
  })
  async findByProfessional(
    @Param('professionalId') professionalId: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.schedulesService.findByProfessional(professionalId, {
      status,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule retrieved successfully.' })
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule and all future events in the same series' })
  @ApiResponse({ 
    status: 200, 
    description: 'Schedule and all future events in the series deleted successfully.' 
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found'
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete schedule with existing appointments'
  })
  async remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a schedule and all future events in the same series' })
  @ApiResponse({ 
    status: 200, 
    description: 'Schedule and all future events in the series updated successfully.' 
  })
  @ApiResponse({
    status: 404,
    description: 'Schedule not found'
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot update schedule with existing appointments'
  })
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }
}
