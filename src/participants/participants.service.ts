import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ERROR_CODE_PARTICIPANT_NAME_ALREADY_EXIST } from './participants.error-code';
import { ERROR_MESSAGE_PARTICIPANT_NAME_ALREADY_EXIST } from './participants.error-message';

@Injectable()
export class ParticipantsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}
  async create(eventId: string, createParticipantDto: CreateParticipantDto) {
    const isParticipantExist = await this.eventModel.findOne({
      _id: eventId,
      'participants.name': createParticipantDto.name,
    });

    if (isParticipantExist) {
      throw new ConflictException({
        sucess: false,
        errorCode: ERROR_CODE_PARTICIPANT_NAME_ALREADY_EXIST,
        errorMessage: ERROR_MESSAGE_PARTICIPANT_NAME_ALREADY_EXIST,
      });
    }

    const eventUpdated = await this.eventModel.findByIdAndUpdate(
      eventId,
      {
        $push: {
          participants: createParticipantDto,
        },
      },
      { new: true },
    );
    return eventUpdated;
  }

  findAll() {
    return `This action returns all participants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  async update(
    eventId: string,
    id: string,
    updateParticipantDto: UpdateParticipantDto,
  ) {
    await this.checkParticipantName(eventId, updateParticipantDto.name);
    const update = await this.eventModel.updateOne(
      {
        $and: [
          {
            _id: eventId,
          },
          {
            'participants._id': id,
          },
        ],
      },
      {
        $set: {
          'participants.$.name': updateParticipantDto.name,
        },
      },
      {
        new: true,
      },
    );

    return update;
  }

  async remove(eventId: string, participantId: string) {
    await this.eventModel.updateOne(
      {
        _id: eventId,
      },
      {
        $pull: {
          participants: {
            _id: participantId,
          },
        },
      },
      {
        new: true,
      },
    );

    const eventUpdated = await this.eventModel.findOneAndUpdate(
      {
        _id: eventId,
      },
      {
        $pull: {
          'participants.$[participants].destinations.$[destinations].votes': {
            participantId: participantId,
          },
        },
      },
      {
        new: true,
        arrayFilters: [
          {
            'participants._id': {
              $ne: null,
            },
          },
          {
            'destinations._id': {
              $ne: null,
            },
          },
        ],
      },
    );
    return eventUpdated;
  }

  async getAllVotes(eventId: string, participantId: string) {
    const votesFound = await this.eventModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
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
          'participants.destinations.votes.participantId':
            new mongoose.Types.ObjectId(participantId),
        },
      },
      {
        $project: {
          'destinations._id': '$participants.destinations._id',
          'destinations.name': '$participants.destinations.name',
          'destinations.votes._id': '$participants.destinations.votes._id',
          'destinations.votes.note': '$participants.destinations.votes.note',
          'destinations.votes.participantId':
            '$participants.destinations.votes.participantId',
          _id: '$participants._id',
        },
      },
      {
        $group: {
          _id: '$destinations.votes.participantId',
          destinations: {
            $push: '$destinations',
          },
        },
      },
      {
        $project: {
          'destinations.votes.participantId': 0,
        },
      },
    ]);

    return votesFound.map((votes) => {
      return {
        participantId: votes._id,
        destinations: votes.destinations,
      };
    });
  }

  private async checkParticipantName(eventId: string, nameToCheck: string) {
    const isNameAlreadyUsed = await this.isParticipantNameAlreadyUsed(
      eventId,
      nameToCheck,
    );
    if (isNameAlreadyUsed) {
      throw new ConflictException({
        sucess: false,
        errorCode: ERROR_CODE_PARTICIPANT_NAME_ALREADY_EXIST,
        errorMessage: ERROR_MESSAGE_PARTICIPANT_NAME_ALREADY_EXIST,
      });
    }
  }

  private async isParticipantNameAlreadyUsed(
    eventId: string,
    nameToCheck: string,
  ): Promise<boolean> {
    const isParticipantExist = await this.eventModel.findOne({
      _id: eventId,
      'participants.name': nameToCheck,
    });
    return isParticipantExist !== null;
  }
}
