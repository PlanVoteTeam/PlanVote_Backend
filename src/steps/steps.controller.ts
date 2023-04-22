import {
  Controller,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { ITimeSlot } from './interfaces/steps.interface';
import { EventsService } from 'src/events/events.service';
import { IEvent } from 'src/events/interfaces/event.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ERROR_CODE_STEP_NOT_ENOUGH_PARTICIPANTS,
  ERROR_MESSAGE_STEP_NOT_ENOUGH_COMMON_DATES,
} from './steps.error';

@Controller('events/:eventId/steps')
export class StepsController {
  constructor(
    private readonly stepsService: StepsService,
    private readonly eventService: EventsService,
    @InjectModel('Event') private eventModel: Model<IEvent>,
  ) {}

  @Post()
  async findBestOptions(@Param('eventId') eventId: string) {
    const threshold = 0.2;
    const nbParticipants = await this.eventService.countParticipants(eventId);
    if (nbParticipants < 2) {
      throw new UnprocessableEntityException({
        sucess: false,
        errorCode: ERROR_CODE_STEP_NOT_ENOUGH_PARTICIPANTS,
        errorMessage: ERROR_MESSAGE_STEP_NOT_ENOUGH_COMMON_DATES,
      });
    }
    const event: IEvent = await this.eventService.findOne(eventId);
    const timeSlots: ITimeSlot[] = await this.stepsService.findTimeSlotPerUser(
      eventId,
    );
    const timeRanges = this.stepsService.rankCommonTimeSlots(
      timeSlots,
      nbParticipants * threshold,
      event.minDuration,
      event.maxDuration,
    );
    const destinationsAvg = await this.stepsService.findDestinationAvg(eventId);
    return [destinationsAvg, timeRanges];
  }
}
