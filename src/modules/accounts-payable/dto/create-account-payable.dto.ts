import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsEnum,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, RecurrencePeriod } from '../account-payable.schema';

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

  @ApiProperty({
    description: 'Descrição do pagamento',
    example: 'Pagamento de aluguel',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Tipo do pagamento',
    example: 'Despesa fixa',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Categoria do pagamento',
    example: 'Aluguel',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Pagamento recorrente?',
    example: false,
  })
  @IsNotEmpty()
  isRecurring: boolean;

  @ApiProperty({
    description: 'Período de recorrência',
    example: RecurrencePeriod.MONTHLY,
    enum: RecurrencePeriod,
    required: false,
  })
  @IsEnum(RecurrencePeriod)
  recurrencePeriod?: RecurrencePeriod;
}
