import { Document } from 'mongoose';
import { IParticipant } from './participant.interface';

export interface IEvent {
  name: string;
  minDuration: number;
  maxDuration: number;
  participants?: IParticipant[];
}
