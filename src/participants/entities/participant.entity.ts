import { Destination } from 'src/destinations/entities/destination.entity';
export class Participant {
  id: string;
  name: string;
  destinations?: Destination[];
  timeslots?: [];
}
