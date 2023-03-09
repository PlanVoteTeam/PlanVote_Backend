import { IParticipant } from '../interfaces/participant.interface';
export class Event {
  name: string;

  minDuration: number;

  maxDuration: number;

  participants?: IParticipant[];
}
