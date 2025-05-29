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
import { AppointmentsService } from './appointments.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { UpdateAppointmentStatusDto } from './dto/confirm-appointment.dto';
import { CreateAppointmentFinanceDto } from './dto/create-appointment-finance.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CheckAvailabilityResponse } from './interfaces/check-availability.interface';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created.',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Post('finance')
  @ApiOperation({ summary: 'Create a new appointment with finance details' })
  @ApiResponse({
    status: 201,
    description:
      'The appointment has been successfully created with finance details.',
  })
  createWithFinance(
    @Body() createAppointmentFinanceDto: CreateAppointmentFinanceDto,
  ) {
    return this.appointmentsService.createWithFinance(
      createAppointmentFinanceDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Return all appointments.' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by id' })
  @ApiResponse({ status: 200, description: 'Return the appointment.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status' })
  @ApiResponse({
    status: 200,
    description: 'Appointment status updated successfully.',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      updateAppointmentStatusDto,
    );
  }

  @Post('check-availability')
  @ApiOperation({ summary: 'Check appointment availability' })
  @ApiResponse({
    status: 200,
    description: 'Availability check completed successfully',
    schema: {
      properties: {
        available: {
          type: 'boolean',
          description: 'Whether the time slot is available',
        },
        conflicts: {
          type: 'object',
          properties: {
            appointments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  startDate: { type: 'string' },
                  startTime: { type: 'string' },
                  endDate: { type: 'string' },
                  endTime: { type: 'string' },
                  status: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid time range or professional is not active',
  })
  @ApiResponse({
    status: 404,
    description: 'Professional not found',
  })
  async checkAvailability(
    @Body() checkAvailabilityDto: CheckAvailabilityDto,
  ): Promise<CheckAvailabilityResponse> {
    return this.appointmentsService.checkAvailability(checkAvailabilityDto);
  }
}
