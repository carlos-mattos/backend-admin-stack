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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './customers.schema';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully.',
    type: Customer,
  })
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of customers retrieved successfully.',
    type: [Customer],
  })
  async findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully.',
    type: Customer,
  })
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully.',
    type: Customer,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully.',
    type: Customer,
  })
  async remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
