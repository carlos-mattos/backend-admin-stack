import { Controller, Get, Post, Body, Put, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AccountsPayableService } from './accounts-payable.service';
import { CreateAccountPayableDto } from './dto/create-account-payable.dto';
import { UpdateAccountPayableDto } from './dto/update-account-payable.dto';
import { AccountPayableDocument } from './account-payable.schema';

@ApiTags('accounts-payable')
@Controller('accounts-payable')
export class AccountsPayableController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts payable' })
  @ApiResponse({
    status: 200,
    description: 'Return all accounts payable',
    type: [CreateAccountPayableDto],
  })
  findAll(): Promise<AccountPayableDocument[]> {
    return this.accountsPayableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account payable by id' })
  @ApiParam({ name: 'id', description: 'Account payable ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the account payable',
    type: CreateAccountPayableDto,
  })
  @ApiResponse({ status: 404, description: 'Account payable not found' })
  findOne(@Param('id') id: string): Promise<AccountPayableDocument> {
    return this.accountsPayableService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new account payable' })
  @ApiResponse({
    status: 201,
    description: 'The account payable has been successfully created',
    type: CreateAccountPayableDto,
  })
  create(
    @Body() createAccountPayableDto: CreateAccountPayableDto,
  ): Promise<AccountPayableDocument> {
    return this.accountsPayableService.create(createAccountPayableDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account payable' })
  @ApiParam({ name: 'id', description: 'Account payable ID' })
  @ApiResponse({
    status: 200,
    description: 'The account payable has been successfully updated',
    type: CreateAccountPayableDto,
  })
  @ApiResponse({ status: 404, description: 'Account payable not found' })
  update(
    @Param('id') id: string,
    @Body() updateAccountPayableDto: UpdateAccountPayableDto,
  ): Promise<AccountPayableDocument> {
    return this.accountsPayableService.update(id, updateAccountPayableDto);
  }
}
