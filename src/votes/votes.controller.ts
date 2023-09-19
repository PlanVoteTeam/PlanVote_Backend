import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IVote } from 'src/events/interfaces/vote.interface';
import { CreateVoteDto } from './dto/create-vote.dto';
import { DeleteVoteDto } from './dto/delete-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import {
  ERROR_CODE_ALREADY_VOTED,
  ERROR_CODE_VOTE_DOESNT_EXIST,
} from './votes.error-code';
import {
  ERROR_MESSAGE_ALREADY_VOTED,
  ERROR_MESSAGE_VOTE_DOESNT_EXIST,
} from './votes.error-message';
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
  ): Promise<IVote> {
    await this.votesService.update(
      eventId,
      participantDestinationId,
      destinationId,
      body,
    );

    const result = await this.votesService.find(
      eventId,
      participantDestinationId,
      destinationId,
      body.participantId,
    );

    if (result.length) return result[0].vote;
    else {
      throw new NotFoundException({
        sucess: false,
        errorCode: ERROR_CODE_VOTE_DOESNT_EXIST,
        errorMessage: ERROR_MESSAGE_VOTE_DOESNT_EXIST,
      });
    }
  }

  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Param('participantDestinationId') participantDestinationId: string,
    @Param('destinationId') destinationId: string,
    @Body() body: CreateVoteDto,
  ): Promise<IVote> {
    const checkAlreadyVote = await this.votesService.find(
      eventId,
      participantDestinationId,
      destinationId,
      body.participantId,
    );

    if (checkAlreadyVote.length > 0) {
      throw new ConflictException({
        sucess: false,
        errorCode: ERROR_CODE_ALREADY_VOTED,
        errorMessage: ERROR_MESSAGE_ALREADY_VOTED,
      });
    }

    await this.votesService.create(
      eventId,
      participantDestinationId,
      destinationId,
      body,
    );
    const result = await this.votesService.find(
      eventId,
      participantDestinationId,
      destinationId,
      body.participantId,
    );

    if (result.length) return result[0].vote;
    else {
      throw new NotFoundException({
        sucess: false,
        errorCode: ERROR_CODE_VOTE_DOESNT_EXIST,
        errorMessage: ERROR_MESSAGE_VOTE_DOESNT_EXIST,
      });
    }
  }

  @Delete()
  async delete(
    @Param('eventId') eventId: string,
    @Param('participantDestinationId') participantDestinationId: string,
    @Param('destinationId') destinationId: string,
    @Body() body: DeleteVoteDto,
  ) {
    const result = await this.votesService.delete(
      eventId,
      participantDestinationId,
      destinationId,
      body._id,
    );
    if (result.modifiedCount) return true;
    else {
      throw new NotFoundException({
        sucess: false,
        errorCode: ERROR_CODE_VOTE_DOESNT_EXIST,
        errorMessage: ERROR_MESSAGE_VOTE_DOESNT_EXIST,
      });
    }
  }
}
