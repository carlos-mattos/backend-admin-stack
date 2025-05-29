import {
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../account-receivable.schema';
import { Types } from 'mongoose';

export class UpdateAccountReceivableDto {
  @ApiProperty({
    description: 'Amount of the receivable',
    example: 1500.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'Due date of the receivable',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiProperty({
    description: 'ID of the customer',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  customerId?: Types.ObjectId;

  @ApiProperty({
    description: 'ID of the payment method',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paymentMethodId?: number;

  @ApiProperty({
    description: 'Status of the receivable',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
