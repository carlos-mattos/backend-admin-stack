import { Types } from 'mongoose';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export interface ConflictAppointment {
  _id: Types.ObjectId;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  conflicts?: {
    appointments: {
      _id: string;
      startDate: string;
      startTime: string;
      endDate: string;
      endTime: string;
      status: AppointmentStatus;
    }[];
  };
  nextAvailableSlot?: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  message?: string;
}
