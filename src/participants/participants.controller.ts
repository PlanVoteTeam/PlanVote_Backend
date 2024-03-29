import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Controller('events/:eventId/participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Body() createParticipantDto: CreateParticipantDto,
  ) {
    return this.participantsService.create(eventId, createParticipantDto);
  }

  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.participantsService.update(eventId, id, updateParticipantDto);
  }

  @Delete(':id')
  remove(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.participantsService.remove(eventId, id);
  }

  @Get(':id/votes')
  async getAllVotesByDestinations(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return await this.participantsService.getAllVotes(eventId, id);
  }
}
