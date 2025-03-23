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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './doctor.schema';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({
    status: 201,
    description: 'Doctor created successfully.',
    type: Doctor,
  })
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all doctors' })
  @ApiResponse({
    status: 200,
    description: 'List of doctors retrieved successfully.',
  })
  async findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a doctor by ID' })
  @ApiResponse({ status: 200, description: 'Doctor retrieved successfully.' })
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a doctor' })
  @ApiResponse({ status: 200, description: 'Doctor deleted successfully.' })
  async remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }

  @Get('/insurances/available')
  @ApiOperation({ summary: 'Retrieve all available insurances' })
  @ApiResponse({
    status: 200,
    description: 'List of available insurances retrieved successfully.',
  })
  async getInsurances() {
    return this.doctorsService.getInsurances();
  }
}
