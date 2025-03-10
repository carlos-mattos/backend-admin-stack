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
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { Procedure } from './procedure.schema';

@ApiTags('procedures')
@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new procedure' })
  @ApiResponse({
    status: 201,
    description: 'Procedure created successfully.',
    type: Procedure,
  })
  async create(@Body() createProcedureDto: CreateProcedureDto) {
    return this.proceduresService.create(createProcedureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all procedures' })
  @ApiResponse({
    status: 200,
    description: 'List of procedures retrieved successfully.',
  })
  async findAll() {
    return this.proceduresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a procedure by ID' })
  @ApiResponse({
    status: 200,
    description: 'Procedure retrieved successfully.',
  })
  async findOne(@Param('id') id: string) {
    return this.proceduresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing procedure' })
  @ApiResponse({ status: 200, description: 'Procedure updated successfully.' })
  async update(
    @Param('id') id: string,
    @Body() updateProcedureDto: UpdateProcedureDto,
  ) {
    return this.proceduresService.update(id, updateProcedureDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a procedure' })
  @ApiResponse({ status: 200, description: 'Procedure deleted successfully.' })
  async remove(@Param('id') id: string) {
    return this.proceduresService.remove(id);
  }
}
