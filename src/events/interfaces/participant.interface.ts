import { IDestination } from './destination.interface';
import { ITimeSlot } from './time-slot.interface';

export interface IParticipant {
  _id: string;
  name: string;
  destinations: IDestination[];
  timeSlots: ITimeSlot[];
}
