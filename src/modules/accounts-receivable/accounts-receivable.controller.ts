import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AccountsReceivableService } from './accounts-receivable.service';
import { CreateAccountReceivableDto } from './dto/create-account-receivable.dto';
import { UpdateAccountReceivableDto } from './dto/update-account-receivable.dto';
import { AccountReceivableDocument } from './account-receivable.schema';

@ApiTags('accounts-receivable')
@Controller('accounts-receivable')
export class AccountsReceivableController {
  constructor(private readonly accountsReceivableService: AccountsReceivableService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts receivable' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all accounts receivable',
    type: [CreateAccountReceivableDto]
  })
  findAll(): Promise<AccountReceivableDocument[]> {
    return this.accountsReceivableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account receivable by id' })
  @ApiParam({ name: 'id', description: 'Account receivable ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the account receivable',
    type: CreateAccountReceivableDto
  })
  @ApiResponse({ status: 404, description: 'Account receivable not found' })
  findOne(@Param('id') id: string): Promise<AccountReceivableDocument> {
    return this.accountsReceivableService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new account receivable' })
  @ApiResponse({ 
    status: 201, 
    description: 'The account receivable has been successfully created',
    type: CreateAccountReceivableDto
  })
  create(@Body() createAccountReceivableDto: CreateAccountReceivableDto): Promise<AccountReceivableDocument> {
    return this.accountsReceivableService.create(createAccountReceivableDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an account receivable' })
  @ApiParam({ name: 'id', description: 'Account receivable ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The account receivable has been successfully updated',
    type: CreateAccountReceivableDto
  })
  @ApiResponse({ status: 404, description: 'Account receivable not found' })
  update(
    @Param('id') id: string,
    @Body() updateAccountReceivableDto: UpdateAccountReceivableDto,
  ): Promise<AccountReceivableDocument> {
    return this.accountsReceivableService.update(id, updateAccountReceivableDto);
  }
} 