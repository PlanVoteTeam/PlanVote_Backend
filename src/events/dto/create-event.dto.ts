import { IStepReference } from '../interfaces/step-reference.interface';

export class CreateEventDto {
  name: string;
  description?: string;
  minDuration?: number;
  maxDuration?: number;
  step?: IStepReference;
}
