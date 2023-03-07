import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
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

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
