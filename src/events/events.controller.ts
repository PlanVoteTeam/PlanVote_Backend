import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from './interfaces/event.interface';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    @InjectModel('Event') private eventModel: Model<IEvent>,
  ) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll() {
    // const participantCreated = new this.participantModel({
    //   name: 'Dylan',
    // });
    // const saved = await participantCreated.save();
    const eventCreated = new this.eventModel({
      name: 'Test',
      participants: [
        {
          name: 'Dylan',
          timeSlots: [
            {
              startDate: '',
              endDate: '',
            },
          ],
        },
      ],
    });
    // eventCreated.
    const save = await eventCreated.save();
    return this.eventModel.findById(save._id);
    // return this.eventModel.findById(save._id).populate('participants');
    // return this.eventModel.updateOne(
    //   {
    //     _id: '6405f10cba4570f0e0be9c39',
    //   },
    //   {
    //     $set: {
    //       name: 'Un vrai test',
    //     },
    //   },
    // );
    // this.eventModel.updateOne(
    //   {
    //     _id: '',
    //   },
    // );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
