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
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './professionals.schema';
import { Service } from '../services/services.schema';

@ApiTags('professionals')
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new professional' })
  @ApiResponse({
    status: 201,
    description: 'Professional created successfully.',
    type: Professional,
  })
  async create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.create(createProfessionalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all professionals' })
  @ApiResponse({
    status: 200,
    description: 'List of professionals retrieved successfully.',
    type: [Professional],
  })
  async findAll() {
    return this.professionalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a professional by ID' })
  @ApiResponse({
    status: 200,
    description: 'Professional retrieved successfully.',
    type: Professional,
  })
  async findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing professional' })
  @ApiResponse({
    status: 200,
    description: 'Professional updated successfully.',
    type: Professional,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProfessionalDto: UpdateProfessionalDto,
  ) {
    return this.professionalsService.update(id, updateProfessionalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a professional by ID' })
  @ApiResponse({
    status: 200,
    description: 'Professional deleted successfully.',
    type: Professional,
  })
  async remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Retrieve all services provided by a professional' })
  @ApiResponse({
    status: 200,
    description:
      'List of services provided by the professional retrieved successfully.',
    type: [Service],
  })
  async getServicesByProfessionalId(@Param('id') id: string) {
    return this.professionalsService.getServicesByProfessionalId(id);
  }
}
