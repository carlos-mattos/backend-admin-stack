import { Types } from 'mongoose';

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
  scheduleId?: string;
  conflicts?: {
    appointments: {
      _id: string;
      startDate: string;
      startTime: string;
      endDate: string;
      endTime: string;
      status: string;
    }[];
  };
}
