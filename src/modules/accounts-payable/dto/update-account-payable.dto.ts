import {
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, RecurrencePeriod } from '../account-payable.schema';

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

  @ApiProperty({
    description: 'Descrição do pagamento',
    example: 'Pagamento de aluguel',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tipo do pagamento',
    example: 'Despesa fixa',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Categoria do pagamento',
    example: 'Aluguel',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Pagamento recorrente?',
    example: false,
    required: false,
  })
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({
    description: 'Período de recorrência',
    example: RecurrencePeriod.MONTHLY,
    enum: RecurrencePeriod,
    required: false,
  })
  @IsOptional()
  @IsEnum(RecurrencePeriod)
  recurrencePeriod?: RecurrencePeriod;
}
