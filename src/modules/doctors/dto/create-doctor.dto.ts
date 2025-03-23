import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'Full name of the doctor',
    example: 'Dr. John Doe',
  })
  fullName: string;

  @ApiProperty({ description: 'CRM of the doctor', example: '123456' })
  crm: string;

  @ApiProperty({ description: 'Contact information', example: '+1234567890' })
  contact: string;

  @ApiProperty({
    description: 'Documents related to the doctor',
    example: 'Document details',
  })
  documents: string;

  @ApiPropertyOptional({
    description: 'List of procedure IDs handled by the doctor',
    type: [String],
    example: ['603d2149fc13ae1f2b000001', '603d2149fc13ae1f2b000002'],
  })
  proceduresHandled?: string[];

  @ApiProperty({
    description: 'List of insurances accepted by the doctor',
    type: [String],
    example: ['Insurance A', 'Insurance B'],
  })
  acceptedInsurances: string[];
}
