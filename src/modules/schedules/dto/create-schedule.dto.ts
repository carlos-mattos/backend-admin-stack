import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsTimeZone,
} from 'class-validator';
import { ScheduleStatus, RecurrenceType } from '../schedule.schema';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Professional ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  professional: string;

  @ApiProperty({
    description: 'Start date of the schedule',
    example: '2024-03-20',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'End date of the schedule',
    example: '2024-03-20',
  })
  @IsString()
  endDate: string;

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '09:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time in HH:mm format',
    example: '17:00',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Timezone of the schedule',
    example: 'America/Sao_Paulo',
  })
  @IsTimeZone()
  timezone: string;

  @ApiProperty({
    description: 'Status of the schedule',
    enum: ScheduleStatus,
    example: ScheduleStatus.SCHEDULED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @ApiProperty({
    description: 'Recurrence type',
    enum: RecurrenceType,
    example: RecurrenceType.NONE,
    required: false,
  })
  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrence?: RecurrenceType;

  @ApiProperty({
    description: 'Date until which the schedule repeats',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  repeatUntil?: Date;

  @ApiProperty({
    description: 'Custom recurrence days',
    example: ['monday', 'wednesday', 'friday'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  customRecurrenceDays?: string[];
}
