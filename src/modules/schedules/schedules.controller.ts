import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a schedule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule retrieved successfully.' })
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a single schedule (just this event)' })
  @ApiResponse({ status: 200, description: 'Schedule updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a single schedule (just this event)' })
  @ApiResponse({ status: 200, description: 'Schedule deleted successfully.' })
  async remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }

  @Delete('doctor/:doctorId/future/:scheduleId')
  @ApiOperation({
    summary: 'Delete this event and all future events in the same series',
  })
  async deleteFutureEvents(
    @Param('doctorId') doctorId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    const deletedCount = await this.schedulesService.removeFutureEvents(
      doctorId,
      scheduleId,
    );
    return { deletedCount };
  }

  @Patch('doctor/:doctorId/future/:scheduleId')
  @ApiOperation({
    summary: 'Update this event and all future events in the same series',
  })
  async updateFutureEvents(
    @Param('doctorId') doctorId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const updatedCount = await this.schedulesService.updateFutureEvents(
      doctorId,
      scheduleId,
      updateScheduleDto,
    );
    return { updatedCount };
  }
}
