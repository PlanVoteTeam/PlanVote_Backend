import { Injectable } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { ERROR_CODE_DESTINATION_ALREADY_EXIST } from './destinations.error-code';
import { ERROR_MESSAGE_DESTINATION_ALREADY_EXIST } from './destinations.error-message';
import { Destination } from './entities/destination.entity';

@Injectable()
export class DestinationsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}
  async create(
    eventId: string,
    participantId: string,
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
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
      .filter((p) => p._id == participantId)[0]
      .destinations.filter((d) => d.name == createDestinationDto.name)[0];

    return {
      name: newDestination.name,
      img: newDestination.img,
      _id: newDestination._id,
    };
  }
}
