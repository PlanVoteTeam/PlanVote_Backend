import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ParticipantsController', () => {
  let controller: ParticipantsController;

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
      controllers: [ParticipantsController],
      providers: [...mockMongooseTokens, ParticipantsService],
    }).compile();

    controller = module.get<ParticipantsController>(ParticipantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
