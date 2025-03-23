import { ApiProperty } from '@nestjs/swagger';

export class CreateProcedureDto {
  @ApiProperty({
    description: 'Name of the procedure',
    example: 'Teeth Whitening',
  })
  procedureName: string;

  @ApiProperty({ description: 'Category of the procedure', example: 'Dental' })
  category: string;

  @ApiProperty({
    description:
      'Duration of the procedure in hours (represents the time the procedure takes)',
    example: 1.5,
  })
  duration: number;

  @ApiProperty({ description: 'Price of the procedure in R$', example: 150.0 })
  price: number;

  @ApiProperty({
    description: 'Indicates if the procedure is covered by insurance',
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
