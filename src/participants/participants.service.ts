import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  remove(id: number) {
    return `This action removes a #${id} participant`;
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
