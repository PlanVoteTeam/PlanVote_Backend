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

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
