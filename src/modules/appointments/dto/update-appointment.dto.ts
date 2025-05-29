import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaymentStatus } from '../enums/payment-status.enum';

export class UpdateAppointmentDto {
  @ApiProperty({
    description: 'Title of the appointment',
    example: 'Teste Um',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the appointment',
    example: 'teste',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Payment status of the appointment',
    example: PaymentStatus.PAID,
    required: false,
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
