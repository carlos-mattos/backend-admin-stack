import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentMethod, PaymentMethodDocument } from './payment-method.schema';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private model: Model<PaymentMethodDocument>,
  ) {}

  async findAll(): Promise<PaymentMethodDocument[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<PaymentMethodDocument> {
    const paymentMethod = await this.model
      .findById(new Types.ObjectId(id))
      .exec();
    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    return paymentMethod;
  }

  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodDocument> {
    const createdPaymentMethod = new this.model(createPaymentMethodDto);
    return createdPaymentMethod.save();
  }

  async update(
    id: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodDocument> {
    const updatedPaymentMethod = await this.model
      .findByIdAndUpdate(new Types.ObjectId(id), updatePaymentMethodDto, {
        new: true,
      })
      .exec();

    if (!updatedPaymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }

    return updatedPaymentMethod;
  }

  async remove(id: string): Promise<PaymentMethodDocument> {
    const deletedPaymentMethod = await this.model
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!deletedPaymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }
    return deletedPaymentMethod;
  }
}
