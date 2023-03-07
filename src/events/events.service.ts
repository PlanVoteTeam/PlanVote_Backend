import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EVENT_NOT_FOUND_ERROR_CODE } from './events.error-code';
import { EVENT_NOT_FOUND_ERROR_MESSAGE } from './events.error-message';
import { IEvent } from './interfaces/event.interface';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}
  create(createEventDto: CreateEventDto) {
    const eventCreated = new this.eventModel({
      name: createEventDto.name,
      minDuration: createEventDto.minDuration,
      maxDuration: createEventDto.maxDuration,
    });
    return eventCreated.save();
  }

  findAll() {
    return `This action returns all events`;
  }

  async findOne(id: string) {
    const eventFound = await this.eventModel.findById(id);
    if (!eventFound) {
      throw new NotFoundException({
        errorCode: EVENT_NOT_FOUND_ERROR_CODE,
        errorMessage: EVENT_NOT_FOUND_ERROR_MESSAGE,
      });
    }
    return eventFound;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const eventUpdate = await this.eventModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          name: updateEventDto?.name,
          minDuration: updateEventDto?.minDuration,
          maxDuration: updateEventDto?.maxDuration,
        },
      },
      { new: true },
    );

    return eventUpdate;
  }

  async remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
