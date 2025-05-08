import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsTimeZone } from 'class-validator';
import { ScheduleStatus } from '../schedule.schema';

export class UpdateScheduleDto {
  @ApiProperty({
    description: 'Status of the schedule',
    enum: ScheduleStatus,
    required: false,
    example: 'scheduled',
  })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @ApiProperty({
    description: 'Start time of the schedule in HH:mm format',
    required: false,
    example: '09:00',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({
    description: 'End time of the schedule in HH:mm format',
    required: false,
    example: '17:00',
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({
    description: 'Timezone of the schedule',
    required: false,
    example: 'America/Sao_Paulo',
  })
  @IsOptional()
  @IsTimeZone()
  timezone?: string;
}
