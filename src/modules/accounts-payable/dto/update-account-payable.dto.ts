import { IsOptional, IsNumber, IsDate, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../account-payable.schema';

export class UpdateAccountPayableDto {
  @ApiProperty({
    description: 'Amount of the payable',
    example: 1500.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'Due date of the payable',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiProperty({
    description: 'Vendor name',
    example: 'Supplier XYZ',
    required: false,
  })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiProperty({
    description: 'Status of the payable',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
} 