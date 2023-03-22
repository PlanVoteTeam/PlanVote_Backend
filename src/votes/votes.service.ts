import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { IVote } from 'src/events/interfaces/vote.interface';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import mongoose from 'mongoose';

@Injectable()
export class VotesService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}

  async update(
    eventId: string,
    participantDestinatonId: string,
    destinationId: string,
    updateVoteDto: UpdateVoteDto,
  ): Promise<any> {
    return await this.eventModel.updateOne(
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
  }

  async create(
    eventId: string,
    participantDestinatonId: string,
    destinationId: string,
    createVoteDto: CreateVoteDto,
  ): Promise<any> {
    return await this.eventModel.updateOne(
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
  }

  async find(
    eventId: string,
    participantDestinatonId: string,
    destinationId: string,
    voteParticipantId: string,
  ): Promise<{ _id: string; vote: IVote }[]> {
    const result = await this.eventModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.destinations',
      },

      {
        $unwind: '$participants.destinations.votes',
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
          'participants._id': new mongoose.Types.ObjectId(
            participantDestinatonId,
          ),
          'participants.destinations._id': new mongoose.Types.ObjectId(
            destinationId,
          ),
          'participants.destinations.votes.participantId':
            new mongoose.Types.ObjectId(voteParticipantId),
        },
      },
      {
        $project: {
          vote: '$participants.destinations.votes',
        },
      },
    ]);
    return result;
  }
}
