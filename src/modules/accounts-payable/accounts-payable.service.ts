import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AccountPayable,
  AccountPayableDocument,
} from './account-payable.schema';
import { CreateAccountPayableDto } from './dto/create-account-payable.dto';
import { UpdateAccountPayableDto } from './dto/update-account-payable.dto';

@Injectable()
export class AccountsPayableService {
  constructor(
    @InjectModel(AccountPayable.name)
    private model: Model<AccountPayableDocument>,
  ) {}

  async findAll(): Promise<AccountPayableDocument[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<AccountPayableDocument> {
    const accountPayable = await this.model
      .findById(new Types.ObjectId(id))
      .exec();
    if (!accountPayable) {
      throw new NotFoundException(`Account payable with ID ${id} not found`);
    }
    return accountPayable;
  }

  async create(
    createAccountPayableDto: CreateAccountPayableDto,
  ): Promise<AccountPayableDocument> {
    const createdAccountPayable = new this.model(createAccountPayableDto);
    return createdAccountPayable.save();
  }

  async update(
    id: string,
    updateAccountPayableDto: UpdateAccountPayableDto,
  ): Promise<AccountPayableDocument> {
    const updatedAccountPayable = await this.model
      .findByIdAndUpdate(new Types.ObjectId(id), updateAccountPayableDto, {
        new: true,
      })
      .exec();

    if (!updatedAccountPayable) {
      throw new NotFoundException(`Account payable with ID ${id} not found`);
    }

    return updatedAccountPayable;
  }
}
