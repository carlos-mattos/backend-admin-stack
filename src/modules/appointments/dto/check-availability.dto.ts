import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CheckAvailabilityDto {
  @ApiProperty({
    description: 'Professional ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  professional: Types.ObjectId;

  @ApiProperty({
    description: 'Start date in YYYY-MM-DD format',
    example: '2024-03-20',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '09:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End date in YYYY-MM-DD format',
    example: '2024-03-20',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'End time in HH:mm format',
    example: '10:00',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Appointment ID to exclude from check (for updates)',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  excludeId?: Types.ObjectId;
} 