import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Controller('events/:eventId/participants/:participantId/destination')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Param('participantId') participantId: string,
    @Body() createDestinationDto: CreateDestinationDto,
  ) {
    return this.destinationsService.create(
      eventId,
      participantId,
      createDestinationDto,
    );
  }

  @Delete()
  async remove(
    @Param('eventId') eventId: string,
    @Param('participantId') participantId: string,
    @Body() body: { id: string },
  ) {
    return this.destinationsService.remove(eventId, participantId, body.id);
  }
}
