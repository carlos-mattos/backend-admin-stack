import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckAvailabilityDto {
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
    description: 'Timezone of the appointment',
    example: 'America/Sao_Paulo',
  })
  @IsNotEmpty()
  @IsString()
  timezone: string;

  @ApiProperty({
    description: 'Appointment ID to exclude from check',
    example: '507f1f77bcf86cd799439011',
    minLength: 24,
    maxLength: 24,
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  excludeId?: string;
}
