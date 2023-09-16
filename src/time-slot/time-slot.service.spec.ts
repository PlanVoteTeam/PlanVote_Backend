import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotService } from './time-slot.service';
import { getModelToken } from '@nestjs/mongoose';

describe('TimeSlotService', () => {
  let service: TimeSlotService;

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
      providers: [...mockMongooseTokens, TimeSlotService],
    }).compile();

    service = module.get<TimeSlotService>(TimeSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
