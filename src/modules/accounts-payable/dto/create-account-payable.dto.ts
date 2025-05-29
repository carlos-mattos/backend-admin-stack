import { IsNotEmpty, IsNumber, IsDate, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../account-payable.schema';

export class CreateAccountPayableDto {
  @ApiProperty({
    description: 'Amount of the payable',
    example: 1500.5,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Due date of the payable',
    example: '2024-12-31',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Vendor name',
    example: 'Supplier XYZ',
  })
  @IsNotEmpty()
  @IsString()
  vendor: string;

  @ApiProperty({
    description: 'Status of the payable',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
} 