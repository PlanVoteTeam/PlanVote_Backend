import { Controller, Param, Post } from '@nestjs/common';
import { StepsService } from './steps.service';
import { IParticipantWithTimeSlots } from './interfaces/steps.interface';
import { EventsService } from 'src/events/events.service';
import { IEvent } from 'src/events/interfaces/event.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('events/:eventId/steps')
export class StepsController {
  constructor(
    private readonly stepsService: StepsService,
    private readonly eventService: EventsService,
    @InjectModel('Event') private eventModel: Model<IEvent>,
  ) {}

  @Post()
  async findBestOptions(@Param('eventId') eventId: string) {
    const event: IEvent = await this.eventService.findOne(eventId);
    const timeSlotsPerUser: IParticipantWithTimeSlots[] =
      await this.stepsService.findTimeSlotPerUser(eventId);
    const timeRanges = this.stepsService.calculateCommonTimeSlots(
      timeSlotsPerUser,
      event.minDuration,
      event.maxDuration,
    );
    const destinationsAvg = await this.stepsService.findDestinationAvg(eventId);
    return [destinationsAvg, timeRanges];
  }
}
