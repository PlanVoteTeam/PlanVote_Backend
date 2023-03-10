import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EVENT_NOT_FOUND_ERROR_CODE } from './events.error-code';
import { EVENT_NOT_FOUND_ERROR_MESSAGE } from './events.error-message';
import { IEvent } from './interfaces/event.interface';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const eventSaved = await this.eventModel.create({
      name: createEventDto.name,
      minDuration: createEventDto.minDuration,
      maxDuration: createEventDto.maxDuration,
    });
    return {
      name: eventSaved.name,
      minDuration: eventSaved.minDuration,
      maxDuration: eventSaved.maxDuration,
    };
  }

  findAll() {
    return `This action returns all events`;
  }

  async findOne(id: string): Promise<Event> {
    const eventFound = await this.eventModel.findById(id);
    if (!eventFound) {
      throw new NotFoundException({
        errorCode: EVENT_NOT_FOUND_ERROR_CODE,
        errorMessage: EVENT_NOT_FOUND_ERROR_MESSAGE,
      });
    }
    return {
      name: eventFound.name,
      minDuration: eventFound.minDuration,
      maxDuration: eventFound.maxDuration,
      participants: eventFound.participants,
    };
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
