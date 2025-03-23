import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Start date and time of the schedule',
    example: '2025-04-01T09:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'End date and time of the schedule',
    example: '2025-04-01T10:00:00Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'ID of the doctor associated with the schedule',
    example: '603d2149fc13ae1f2b000001',
  })
  doctor: string;

  @ApiPropertyOptional({
    description: 'Status of the schedule',
    example: 'scheduled',
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Additional notes for the schedule',
    example: 'Patient requires fasting',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Recurrence pattern for the schedule',
    enum: ['none', 'daily', 'weekly', 'monthly', 'custom'],
    default: 'none',
  })
  recurrence?: string;

  @ApiPropertyOptional({
    description: 'Date until which the schedule should repeat',
    example: '2025-05-01T00:00:00Z',
  })
  repeatUntil?: Date;

  @ApiPropertyOptional({
    description:
      'Days of the week for custom recurrence (only if recurrence is "custom")',
    type: [String],
    example: ['Monday', 'Wednesday', 'Friday'],
  })
  customRecurrenceDays?: string[];
}
