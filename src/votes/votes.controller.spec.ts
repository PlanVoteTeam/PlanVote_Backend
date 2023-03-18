import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { IVote } from 'src/events/interfaces/vote.interface';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

describe('VotesController', () => {
  let controller: VotesController;
  let service: VotesService;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: Model,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [...mockMongooseTokens, VotesService],
    }).compile();

    controller = module.get<VotesController>(VotesController);
    service = module.get<VotesService>(VotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Add a vote', () => {
    it('should return a vote', async () => {
      const voteCreated: IVote = {
        _id: '',
        participantId: '',
        note: 5,
      };
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const createVoteDto: CreateVoteDto = {
        participantId: '',
        note: 5,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createVoteDto);
      expect(
        await controller.create(
          eventId,
          participantDestinationId,
          destinationId,
          createVoteDto,
        ),
      ).toBe(voteCreated);
    });
  });

  describe('Update a vote', () => {
    it('should return a vote', async () => {
      const voteUpdated: IVote = {
        _id: '',
        participantId: '',
        note: 4,
      };
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const updateVoteDto: UpdateVoteDto = {
        participantId: '',
        note: 4,
      };
      jest.spyOn(service, 'update').mockResolvedValue(updateVoteDto);
      expect(
        await controller.update(
          eventId,
          participantDestinationId,
          destinationId,
          updateVoteDto,
        ),
      ).toBe(voteUpdated);
    });
  });
});
