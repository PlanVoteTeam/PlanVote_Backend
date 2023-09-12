import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { ERROR_CODE_DESTINATION_ALREADY_EXIST } from './destinations.error-code';
import { ERROR_MESSAGE_DESTINATION_ALREADY_EXIST } from './destinations.error-message';
import { IDestination } from 'src/events/interfaces/destination.interface';
import { IEvent } from 'src/events/interfaces/event.interface';

@Injectable()
export class DestinationsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}
  async create(
    eventId: string,
    participantId: string,
    createDestinationDto: CreateDestinationDto,
  ): Promise<IDestination> {
    const isDestinationExist = await this.eventModel.findOne({
      $and: [
        { _id: eventId },
        { 'participants.destinations.name': createDestinationDto.name },
      ],
    });

    if (isDestinationExist) {
      throw new ConflictException({
        sucess: false,
        errorCode: ERROR_CODE_DESTINATION_ALREADY_EXIST,
        errorMessage: ERROR_MESSAGE_DESTINATION_ALREADY_EXIST,
      });
    }

    const updatedEvent: any = await this.eventModel.findOneAndUpdate(
      { $and: [{ _id: eventId }, { 'participants._id': participantId }] },
      {
        $push: {
          'participants.$.destinations': createDestinationDto,
        },
      },
      {
        new: true,
      },
    );

    return updatedEvent;
  }

  async remove(eventId: string, participantId: string, id: string) {
    const removedDestination: any = await this.eventModel.findOneAndUpdate(
      {
        _id: eventId,
        'participants._id': participantId,
      },
      {
        $pull: {
          'participants.$.destinations': { _id: id },
        },
      },
      {
        new: true,
      },
    );
    return removedDestination;
  }
}
