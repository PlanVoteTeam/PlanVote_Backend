import {
  Controller,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { IStep, ITimeSlot } from './interfaces/steps.interface';
import { EventsService } from 'src/events/events.service';
import { IEvent } from 'src/events/interfaces/event.interface';
import { StepsErrors } from './steps.error';
import { UpdateEventDto } from 'src/events/dto/update-event.dto';

@Controller('events/:eventId/steps')
export class StepsController {
  constructor(
    private readonly stepsService: StepsService,
    private readonly eventService: EventsService,
  ) {}

  @Post()
  async findBestOptions(@Param('eventId') eventId: string) {
    const threshold = 0.2;
    const nbParticipants = await this.eventService.countParticipants(eventId);
    if (nbParticipants < 2) {
      throw new UnprocessableEntityException({
        sucess: false,
        errorCode: StepsErrors.ERROR_CODE_STEP_NOT_ENOUGH_PARTICIPANTS,
        errorMessage: StepsErrors.ERROR_MESSAGE_STEP_NOT_ENOUGH_PARTICIPANTS,
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
    if (destinationsAvg.length === 0) {
      throw new UnprocessableEntityException({
        sucess: false,
        errorCode: StepsErrors.ERROR_CODE_CANT_PROCESS_AVG,
        errorMessage: StepsErrors.ERROR_MESSAGE_CANT_PROCESS_AVG,
      });
    }
    if (event.step) {
      await this.stepsService.deleteStep(event.step._id);
    }
    const step: IStep = await this.stepsService.createStep(
      destinationsAvg,
      timeRanges,
    );
    const updateEventParams: UpdateEventDto = {
      name: event.name,
      step: {
        _id: step._id,
        stepDate: new Date(Date.now()),
      },
    };

    await this.eventService.update(event._id, updateEventParams);

    return step;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.stepsService.findOne(id);
  }
}
