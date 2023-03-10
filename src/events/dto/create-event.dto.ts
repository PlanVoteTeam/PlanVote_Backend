export class CreateEventDto {
  name: string;
  description?: string;
  minDuration?: number;
  maxDuration?: number;
}
