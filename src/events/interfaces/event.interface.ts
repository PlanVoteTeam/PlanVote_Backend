import { IParticipant } from './participant.interface';

export interface IEvent {
  _id?: string;
  name: string;
  description?: string;
  minDuration: number;
  maxDuration: number;
  participants?: IParticipant[];
}
