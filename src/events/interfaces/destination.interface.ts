import { IVote } from './vote.interface';

export interface IDestination {
  _id: string;
  name: string;
  img?: string;
  votes?: IVote[];
}
