import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { IVote } from 'src/events/interfaces/vote.interface';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { NotFoundException } from '@nestjs/common';
import { DeleteVoteDto } from './dto/delete-vote.dto';

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
      const result = [{ _id: '', vote: voteCreated }];
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const createVoteDto: CreateVoteDto = {
        participantId: '',
        note: 5,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createVoteDto);
      jest.spyOn(service, 'find').mockResolvedValue(result);

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
      const result = [{ _id: '', vote: voteUpdated }];
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const updateVoteDto: UpdateVoteDto = {
        participantId: '',
        note: 4,
      };
      jest.spyOn(service, 'update').mockResolvedValue(updateVoteDto);
      jest.spyOn(service, 'find').mockResolvedValue(result);
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

  describe('Delete a vote', () => {
    it('should delete a vote', async () => {
      const voteDeletion = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      const result = true;
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const body: DeleteVoteDto = { _id: '' };
      jest.spyOn(service, 'delete').mockResolvedValue(voteDeletion);
      expect(
        await controller.delete(
          eventId,
          participantDestinationId,
          destinationId,
          body,
        ),
      ).toBe(result);
    });

    it("should throw an error because vote doesn't exist", async () => {
      const voteDeletion = {
        acknowledged: true,
        modifiedCount: 0,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const body: DeleteVoteDto = { _id: '' };
      jest.spyOn(service, 'delete').mockResolvedValue(voteDeletion);
      expect(
        controller.delete(
          eventId,
          participantDestinationId,
          destinationId,
          body,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
