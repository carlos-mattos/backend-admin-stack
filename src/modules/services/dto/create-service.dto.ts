import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Name of the Service',
    example: 'Teeth Whitening',
  })
  name: string;

  @ApiProperty({ description: 'Category of the Service', example: 'Dental' })
  category: string;

  @ApiProperty({
    description:
      'Duration of the Service in hours (represents the time the Service takes)',
    example: 1.5,
  })
  duration: number;

  @ApiProperty({ description: 'Price of the Service in R$', example: 150.0 })
  price: number;

  @ApiProperty({
    description: 'Indicates if the Service is covered by insurance',
    example: true,
  })
  acceptsInsurance: boolean;

  @ApiProperty({
    description:
      'Number of days until the next contact (e.g., if the next contact is in 30 days, enter 30)',
    example: 30,
  })
  nextContactDays: number;
}
