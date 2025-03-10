import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID of the patient',
    example: '603d2149fc13ae1f2b000003',
  })
  patient: string;

  @ApiProperty({
    description: 'ID of the doctor',
    example: '603d2149fc13ae1f2b000001',
  })
  doctor: string;

  @ApiProperty({
    description: 'ID of the procedure',
    example: '603d2149fc13ae1f2b000004',
  })
  procedure: string;

  @ApiProperty({
    description: 'Date of the appointment',
    example: '2025-04-01',
  })
  date: Date;

  @ApiProperty({ description: 'Time of the appointment', example: '09:00' })
  time: string;
}
