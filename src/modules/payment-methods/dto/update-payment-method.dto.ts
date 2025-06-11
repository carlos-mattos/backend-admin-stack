import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: 'Name of the payment method',
    example: 'Credit Card',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
} 