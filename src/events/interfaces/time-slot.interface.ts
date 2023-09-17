import { Date } from 'mongoose';

export interface ITimeSlot {
  _id: string;
  startDate: string;
  endDate: string;
}

export interface ITimeSlotFound {
  _id: string;
  timeSlots: ITimeSlot[];
}
