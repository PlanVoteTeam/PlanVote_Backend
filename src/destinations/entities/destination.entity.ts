import { IVote } from 'src/events/interfaces/vote.interface';

export class Destination {
  name: string;
  img: string;
  _id: string;
  votes?: IVote[];
}
