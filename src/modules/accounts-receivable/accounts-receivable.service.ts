import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AccountReceivable,
  AccountReceivableDocument,
} from './account-receivable.schema';
import { CreateAccountReceivableDto } from './dto/create-account-receivable.dto';
import { UpdateAccountReceivableDto } from './dto/update-account-receivable.dto';

@Injectable()
export class AccountsReceivableService {
  constructor(
    @InjectModel(AccountReceivable.name)
    private accountReceivableModel: Model<AccountReceivableDocument>,
  ) {}

  async findAll(): Promise<AccountReceivableDocument[]> {
    return this.accountReceivableModel.find().exec();
  }

  async findOne(id: string): Promise<AccountReceivableDocument> {
    const accountReceivable = await this.accountReceivableModel
      .findById(id)
      .exec();
    if (!accountReceivable) {
      throw new NotFoundException(`Account receivable with ID ${id} not found`);
    }
    return accountReceivable;
  }

  async create(
    createAccountReceivableDto: CreateAccountReceivableDto,
  ): Promise<AccountReceivableDocument> {
    const createdAccountReceivable = new this.accountReceivableModel({
      ...createAccountReceivableDto,
      customerId: new Types.ObjectId(createAccountReceivableDto.customerId),
    });
    return createdAccountReceivable.save();
  }

  async update(
    id: string,
    updateAccountReceivableDto: UpdateAccountReceivableDto,
  ): Promise<AccountReceivableDocument> {
    const updateData = { ...updateAccountReceivableDto };
    if (updateAccountReceivableDto.customerId) {
      updateData.customerId = new Types.ObjectId(
        updateAccountReceivableDto.customerId,
      );
    }

    const updatedAccountReceivable = await this.accountReceivableModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedAccountReceivable) {
      throw new NotFoundException(`Account receivable with ID ${id} not found`);
    }

    return updatedAccountReceivable;
  }
}
