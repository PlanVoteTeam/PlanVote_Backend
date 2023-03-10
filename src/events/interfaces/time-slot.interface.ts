import { Date } from 'mongoose';

export interface ITimeSlot {
  _id: string;
  startDate: Date;
  endDate: Date;
}
