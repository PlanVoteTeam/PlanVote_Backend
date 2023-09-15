import { Test, TestingModule } from '@nestjs/testing';
import { StepsService } from './steps.service';
import { IStep } from './interfaces/steps.interface';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import * as mockdata from './mockStepData.json';

describe('StepsService', () => {
  let service: StepsService;

  let stepModelMock: Model<IStep>;
  let eventModelMock: Model<IEvent>;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Step'),
      useValue: {
        deleteOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
      },
    },
    {
      provide: getModelToken('Event'),
      useValue: {
        aggregate: jest.fn(),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...mockMongooseTokens, StepsService],
    }).compile();

    service = module.get<StepsService>(StepsService);
    stepModelMock = module.get<Model<IStep>>(getModelToken('Step'));
    eventModelMock = module.get<Model<IEvent>>(getModelToken('Event'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle a step', () => {
    it('should create a step', async () => {
      const bestDestinations = mockdata.findBestOptions.bestDestinations as any;
      const glidingWindows = mockdata.findBestOptions.rankedTimeSlots as any;
      const createdStep = mockdata.findBestOptions.stepCreated;
      jest
        .spyOn(stepModelMock, 'create')
        .mockImplementationOnce(() => Promise.resolve(createdStep) as any);
      expect(
        service.createStep(bestDestinations, glidingWindows),
      ).resolves.toStrictEqual(createdStep);
    });

    it('should delete a step', async () => {
      const stepId = 'abc';
      const nbDeleted = 1;
      jest
        .spyOn(stepModelMock, 'deleteOne')
        .mockImplementationOnce(() => Promise.resolve(nbDeleted) as any);

      expect(service.deleteStep(stepId)).resolves.toStrictEqual(nbDeleted);
    });

    it('should find a step', async () => {
      const stepId = 'abc';
      const foundStep = mockdata.findBestOptions.stepCreated;

      jest
        .spyOn(stepModelMock, 'findById')
        .mockImplementationOnce(() => Promise.resolve(foundStep) as any);

      expect(service.findOne(stepId)).resolves.toStrictEqual(foundStep);
    });
  });
});
