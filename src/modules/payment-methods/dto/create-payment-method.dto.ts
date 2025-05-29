import { IsNotEmpty, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Name of the payment method',
    example: 'Credit Card',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether the payment method is active',
    example: true,
    default: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Display order of the payment method',
    example: 1,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  displayOrder: number;
} 