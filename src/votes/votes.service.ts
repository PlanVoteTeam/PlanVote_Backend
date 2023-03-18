import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { IVote } from 'src/events/interfaces/vote.interface';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Injectable()
export class VotesService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}

  // A refacto pour renvoyer que le vote
  async update(
    eventId: string,
    participantDestinatonId: string,
    destinationId: string,
    updateVoteDto: UpdateVoteDto,
  ): Promise<any> {
    const updatedEvent: any = await this.eventModel.updateOne(
      { _id: eventId },
      {
        $set: {
          'participants.$[participants].destinations.$[destinations].votes.$[votes].note':
            updateVoteDto.note,
        },
      },
      {
        arrayFilters: [
          { 'participants._id': participantDestinatonId },
          { 'destinations._id': destinationId },
          { 'votes.participantId': updateVoteDto.participantId },
        ],
      },
    );
    return updatedEvent;
  }

  // A refacto pour renvoyer que le vote
  async create(
    eventId: string,
    participantDestinatonId: string,
    destinationId: string,
    createVoteDto: CreateVoteDto,
  ): Promise<any> {
    const updatedEvent: any = await this.eventModel.updateOne(
      { _id: eventId },
      {
        $push: {
          'participants.$[participants].destinations.$[destinations].votes':
            createVoteDto,
        },
      },
      {
        arrayFilters: [
          { 'participants._id': participantDestinatonId },
          { 'destinations._id': destinationId },
        ],
      },
    );

    return updatedEvent;
  }
}
