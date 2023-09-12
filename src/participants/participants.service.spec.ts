import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participants.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ParticipantsService', () => {
  let service: ParticipantsService;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: {
        new: jest.fn(),
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        create: jest.fn(),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...mockMongooseTokens, ParticipantsService],
    }).compile();

    service = module.get<ParticipantsService>(ParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
