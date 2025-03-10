import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'Full name of the patient', example: 'John Doe' })
  fullName: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: '123 Main St, City, Country',
  })
  address: string;

  @ApiProperty({
    description: 'Patient documents (e.g., ID, insurance)',
    example: '123456789',
  })
  documents: string;

  @ApiProperty({ description: 'Patient phone number', example: '+1234567890' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Patient email address',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Consent for communication according to LGPD',
    example: true,
  })
  communicationConsent: boolean;
}
