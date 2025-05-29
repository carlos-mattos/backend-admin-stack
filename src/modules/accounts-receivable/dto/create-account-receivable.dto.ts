import { IsNotEmpty, IsNumber, IsDate, IsEnum, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../account-receivable.schema';

export class CreateAccountReceivableDto {
  @ApiProperty({ description: 'Amount of the receivable', example: 1500.50 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Due date of the receivable', example: '2024-12-31' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({ description: 'ID of the customer', example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @ApiProperty({ description: 'ID of the payment method', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  paymentMethodId: number;

  @ApiProperty({ 
    description: 'Status of the receivable',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
} 