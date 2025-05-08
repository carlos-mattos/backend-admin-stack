import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Full name of the Customer',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Address of the Customer',
    example: '123 Main St, City, Country',
  })
  address: string;

  @ApiProperty({
    description: 'Customer documents (e.g., ID, insurance)',
    example: '123456789',
  })
  documents: string;

  @ApiProperty({ description: 'Customer phone number', example: '+1234567890' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Consent for communication according to LGPD',
    example: true,
  })
  communicationConsent: boolean;
}
