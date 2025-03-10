import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ description: 'Date of the schedule', example: '2025-04-01' })
  date: Date;

  @ApiProperty({ description: 'Time of the schedule', example: '09:00' })
  time: string;

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
}
