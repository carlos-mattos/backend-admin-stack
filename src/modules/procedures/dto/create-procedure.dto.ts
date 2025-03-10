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
      'Preparation time in hours (generic for nutrition, rest, fasting, etc.)',
    example: 0.5,
  })
  preparationTime: number;
}
