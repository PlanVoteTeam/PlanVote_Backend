import { Controller, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VotesService } from './votes.service';

@Controller(
  'events/:eventId/participants/:participantDestinationId/destinations/:destinationId/votes',
)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Patch()
  async update(
    @Param('eventId') eventId: string,
    @Param('participantDestinationId') participantDestinationId: string,
    @Param('destinationId') destinationId: string,
    @Body() body: UpdateVoteDto,
  ): Promise<any> {
    return this.votesService.update(
      eventId,
      participantDestinationId,
      destinationId,
      body,
    );
  }

  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Param('participantDestinationId') participantDestinationId: string,
    @Param('destinationId') destinationId: string,
    @Body() body: CreateVoteDto,
  ): Promise<any> {
    return this.votesService.create(
      eventId,
      participantDestinationId,
      destinationId,
      body,
    );
  }
}
