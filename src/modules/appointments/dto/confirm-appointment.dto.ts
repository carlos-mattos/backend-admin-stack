import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'Status of the appointment',
    enum: ['Agendado', 'Pré-agendado', 'Cancelado'],
    example: 'Agendado',
  })
  status: string;
}
