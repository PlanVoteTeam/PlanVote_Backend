import { Document } from 'mongoose';
import { IDestination } from './destination.interface';
import { ITimeSlot } from './time-slot.interface';

export interface IParticipant extends Document {
  name: string;
  destinations: IDestination[];
  timeSlots: ITimeSlot[];
}
