import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/confirm-appointment.dto';
import { Appointment } from './appointment.schema';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CheckAvailabilityResponse } from './interfaces/check-availability.interface';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({
    status: 200,
    description: 'List of all appointments retrieved successfully.',
  })
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully.',
    type: Appointment,
  })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get('professional/:professionalId')
  @ApiOperation({ summary: 'Get all appointments for a professional' })
  @ApiResponse({
    status: 200,
    description: 'List of appointments retrieved successfully.',
  })
  async findByProfessional(@Param('professionalId') professionalId: string) {
    return this.appointmentsService.findByProfessional(professionalId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({
    status: 200,
    description: 'Appointment updated successfully.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({
    status: 200,
    description: 'Appointment deleted successfully.',
  })
  async remove(@Param('id') id: string) {
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
