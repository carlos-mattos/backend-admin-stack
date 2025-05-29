import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Title of the appointment',
    example: 'Teste Um',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the appointment',
    example: 'teste',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Customer ID',
    example: '507f1f77bcf86cd799439012',
    minLength: 24,
    maxLength: 24,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  customer?: string;

  @ApiProperty({
    description: 'Professional ID',
    example: '507f1f77bcf86cd799439011',
    minLength: 24,
    maxLength: 24,
  })
  @IsNotEmpty()
  @IsMongoId()
  professional: string;

  @ApiProperty({
    description: 'Service IDs',
    example: ['507f1f77bcf86cd799439013'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  services?: string[];

  @ApiProperty({
    description: 'Start date in YYYY-MM-DD format',
    example: '2024-03-20',
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '14:30',
  })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End date in YYYY-MM-DD format',
    example: '2024-03-20',
  })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiProperty({
    description: 'End time in HH:mm format',
    example: '15:30',
  })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
    default: AppointmentStatus.SCHEDULED,
  })
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiProperty({
    description: 'Timezone of the appointment',
    example: 'America/Sao_Paulo',
  })
  @IsNotEmpty()
  @IsString()
  timezone: string;

  @ApiProperty({
    description: 'Amount to be paid',
    example: 150.0,
    minimum: 0,
    maximum: 999999.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  amount?: number;

  @ApiProperty({
    description: 'Payment method ID',
    example: '507f1f77bcf86cd799439014',
    minLength: 24,
    maxLength: 24,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  paymentMethodId?: string;
}
