import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  customer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  professional?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  schedule?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsMongoId({ each: true })
  services?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endTime?: string;
}
