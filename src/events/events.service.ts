import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EVENT_NOT_FOUND_ERROR_CODE } from './events.error-code';
import { EVENT_NOT_FOUND_ERROR_MESSAGE } from './events.error-message';
import { IEvent } from './interfaces/event.interface';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}
  async create(createEventDto: CreateEventDto): Promise<IEvent> {
    const eventSaved = await this.eventModel.create({
      name: createEventDto.name,
      description: createEventDto.description,
      minDuration: createEventDto.minDuration,
      maxDuration: createEventDto.maxDuration,
    });
    return eventSaved;
  }

  findAll() {
    return `This action returns all events`;
  }

  async findOne(id: string): Promise<IEvent> {
    const eventFound = await this.eventModel.findById(id);
    if (!eventFound) {
      throw new NotFoundException({
        errorCode: EVENT_NOT_FOUND_ERROR_CODE,
        errorMessage: EVENT_NOT_FOUND_ERROR_MESSAGE,
      });
    }
    return {
      _id: eventFound._id,
      name: eventFound.name,
      description: eventFound.description,
      minDuration: eventFound.minDuration,
      maxDuration: eventFound.maxDuration,
      participants: eventFound.participants,
      step: eventFound.step,
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<IEvent> {
    const eventUpdate = await this.eventModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          name: updateEventDto?.name,
          description: updateEventDto?.description,
          minDuration: updateEventDto?.minDuration,
          maxDuration: updateEventDto?.maxDuration,
          step: updateEventDto?.step,
        },
      },
      { new: true },
    );

    return eventUpdate;
  }

  async countParticipants(eventId: string) {
    const participantCount: any = await this.eventModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $unwind: '$participants',
      },
      {
        $count: 'participants',
      },
    ]);
    if (participantCount.length) {
      return participantCount[0].participants;
    }
    return 0;
  }

  async remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
