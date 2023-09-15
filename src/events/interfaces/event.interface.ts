import { IParticipant } from './participant.interface';
import { IStepReference } from './step-reference.interface';

export interface IEvent {
  _id?: string;
  name: string;
  description?: string;
  minDuration: number;
  maxDuration: number;
  participants?: IParticipant[];
  step?: IStepReference;
}
