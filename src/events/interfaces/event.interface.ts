import { Document } from 'mongoose';
import { IParticipant } from './participant.interface';

export interface IEvent extends Document {
  name: string;
  minDuration: number;
  maxDuration: number;
  participants: IParticipant[];
}
