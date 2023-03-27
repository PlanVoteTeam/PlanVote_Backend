import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { ERROR_CODE_DESTINATION_ALREADY_EXIST } from './destinations.error-code';
import { ERROR_MESSAGE_DESTINATION_ALREADY_EXIST } from './destinations.error-message';
import { IDestination } from 'src/events/interfaces/destination.interface';
import { IEvent } from 'src/events/interfaces/event.interface';
import { IParticipant } from 'src/events/interfaces/participant.interface';

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

    const newDestination = updatedEvent.participants
      .filter((p: IParticipant) => p._id.toString() === participantId)[0]
      .destinations.filter(
        (d: IDestination) => d.name === createDestinationDto.name,
      )[0];

    return {
      name: newDestination.name,
      img: newDestination.img,
      _id: newDestination._id,
    };
  }

  async remove(
    eventId: string,
    participantId: string,
    id: string,
  ): Promise<IEvent> {
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
    );
    return {
      _id: removedDestination._id,
      name: removedDestination.name,
      description: removedDestination.description,
      minDuration: removedDestination.minDuration,
      maxDuration: removedDestination.maxDuration,
      participants: removedDestination.participants,
    };
  }
}
