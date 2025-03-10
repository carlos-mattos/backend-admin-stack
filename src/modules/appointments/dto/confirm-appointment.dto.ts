import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAppointmentDto {
  @ApiProperty({
    description: 'Confirmation status of the appointment',
    example: true,
  })
  confirmed: boolean;
}
