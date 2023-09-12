import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { getModelToken } from '@nestjs/mongoose';

describe('TimeSlotController', () => {
  let controller: TimeSlotController;

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
      controllers: [TimeSlotController],
      providers: [...mockMongooseTokens, TimeSlotService],
    }).compile();

    controller = module.get<TimeSlotController>(TimeSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
