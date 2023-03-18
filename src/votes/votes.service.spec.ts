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
    it('should return a vote added', () => {
      const vote: IVote = {
        _id: '',
        participantId: '',
        note: 5,
      };
      /*
      const destination: IDestination = {
        _id: '',
        name: '',
        img: '',
        votes: [vote],
      };
      const event: IEvent = {
        name: 'test',
        description: '',
        minDuration: 0,
        maxDuration: 0,
        participants: [
          {
            _id: '1',
            name: 'Rémy',
            destinations: [destination],
            timeSlots: [],
          },
        ],
      };
      */
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
      ).resolves.toStrictEqual(vote);
    });
  });

  describe('Add a vote', () => {
    it('should return a vote updated', () => {
      const vote: IVote = {
        _id: '',
        participantId: '',
        note: 5,
      };

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
      ).resolves.toStrictEqual(vote);
    });
  });

  // Tests à refacto après refacto des retours des intéractions vote.
});
