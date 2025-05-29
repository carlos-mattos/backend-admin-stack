import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Name of the payment method',
    example: 'Credit Card',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
} 