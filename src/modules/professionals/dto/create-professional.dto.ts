import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Service } from '../../services/services.schema';

export class CreateProfessionalDto {
  @ApiProperty({
    description: 'Full name of the Professional',
    example: 'Dr. John Doe',
  })
  fullName: string;

  @ApiProperty({ description: 'CRM of the Professional', example: '123456' })
  crm: string;

  @ApiProperty({ description: 'Contact information', example: '+1234567890' })
  contact: string;

  @ApiProperty({
    description: 'Documents related to the Professional',
    example: 'Document details',
  })
  documents: string;

  @ApiPropertyOptional({
    description: 'List of service IDs handled by the Professional',
    type: [String],
    example: ['603d2149fc13ae1f2b000001', '603d2149fc13ae1f2b000002'],
  })
  serviceHandled?: string[];

  @ApiProperty({
    description: 'List of insurances accepted by the Professional',
    type: [String],
    example: ['Insurance A', 'Insurance B'],
  })
  acceptedInsurances: string[];
}
