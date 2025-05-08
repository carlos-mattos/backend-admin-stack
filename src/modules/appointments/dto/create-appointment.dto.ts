import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  customer?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsMongoId()
  professional: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsMongoId()
  schedule: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsMongoId({ each: true })
  services?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: '2025-05-02', required: true })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({ example: '14:00', required: true })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: '2025-05-02', required: true })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiProperty({ example: '15:00', required: true })
  @IsNotEmpty()
  @IsString()
  endTime: string;
}
