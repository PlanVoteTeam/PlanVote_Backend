import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { IVote } from 'src/events/interfaces/vote.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

describe('VotesService', () => {
  let service: VotesService;
  let modelMock: Model<IEvent>;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: {
        updateOne: jest.fn(),
        aggregate: jest.fn(),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...mockMongooseTokens, VotesService],
    }).compile();

    service = module.get<VotesService>(VotesService);
    modelMock = module.get<Model<IEvent>>(getModelToken('Event'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Add a vote', () => {
    it('should return updateOne result', () => {
      const voteInsertion = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const createVoteDto: CreateVoteDto = {
        participantId: '',
        note: 5,
      };

      jest.spyOn(modelMock, 'updateOne').mockResolvedValueOnce(voteInsertion);
      expect(
        service.create(
          eventId,
          participantDestinationId,
          destinationId,
          createVoteDto,
        ),
      ).resolves.toStrictEqual(voteInsertion);
    });
  });

  describe('Add a vote', () => {
    it('should return updateOne result', () => {
      const voteUpdate = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      const eventId = '';
      const participantDestinationId = '';
      const destinationId = '';
      const updateVoteDto: UpdateVoteDto = {
        participantId: '',
        note: 5,
      };

      jest.spyOn(modelMock, 'updateOne').mockResolvedValueOnce(voteUpdate);
      expect(
        service.update(
          eventId,
          participantDestinationId,
          destinationId,
          updateVoteDto,
        ),
      ).resolves.toStrictEqual(voteUpdate);
    });
  });

  describe('Get a vote', () => {
    it('should return an aggregate with 1 vote', () => {
      const vote: IVote = {
        _id: '',
        participantId: '641b24fc4ca08404d963c95a',
        note: 5,
      };
      const result = [{ _id: '641b24fc4ca08404d963c95a', vote: vote }];
      const eventId = '641b24fc4ca08404d963c95a';
      const participantDestinationId = '641b24fc4ca08404d963c95a';
      const destinationId = '641b24fc4ca08404d963c95a';
      const participantVoteId = '641b24fc4ca08404d963c95a';

      jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce(result);
      expect(
        service.find(
          eventId,
          participantDestinationId,
          destinationId,
          participantVoteId,
        ),
      ).resolves.toStrictEqual(result);
    });
  });

  describe('delete a vote', () => {
    it('should an update result with modifiedcount', () => {
      const voteDeleted = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      const eventId = '641b24fc4ca08404d963c95a';
      const participantId = '641b24fc4ca08404d963c95a';
      const destinationId = '641b24fc4ca08404d963c95a';
      const voteId = '641b24fc4ca08404d963c95a';

      jest.spyOn(modelMock, 'updateOne').mockResolvedValueOnce(voteDeleted);
      expect(
        service.delete(eventId, participantId, destinationId, voteId),
      ).resolves.toStrictEqual(voteDeleted);
    });
  });
});
