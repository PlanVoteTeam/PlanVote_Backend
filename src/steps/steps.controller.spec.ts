import { Test, TestingModule } from '@nestjs/testing';
import { StepsController } from './steps.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsService } from 'src/events/events.service';
import { StepsService } from './steps.service';
import * as mockdata from './mockStepData.json';

describe('StepsController', () => {
  let controller: StepsController;
  let eventsService: EventsService;
  let stepsService: StepsService;

  const mockStepModel = {
    deleteOne: jest.fn(),
    create: jest.fn(),
  };

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: Model,
    },
    {
      provide: getModelToken('Step'),
      useValue: mockStepModel,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StepsController],
      providers: [...mockMongooseTokens, EventsService, StepsService],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    stepsService = module.get<StepsService>(StepsService);
    controller = module.get<StepsController>(StepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find best options', () => {
    it('should return step created and update linked event', async () => {
      const participantCount = mockdata.findBestOptions.participantCount;
      const event = mockdata.findBestOptions.event;
      const eventUpdated = mockdata.findBestOptions.eventUpdated;
      const timeSlots = mockdata.findBestOptions.timeSlots;
      const rankedTimeSlots = mockdata.findBestOptions.rankedTimeSlots;
      const bestDestinations = mockdata.findBestOptions.bestDestinations;
      const stepCreated = mockdata.findBestOptions.stepCreated;

      jest
        .spyOn(eventsService, 'countParticipants')
        .mockImplementation(() => Promise.resolve(participantCount));

      jest
        .spyOn(eventsService, 'findOne')
        .mockImplementation(() => Promise.resolve(event) as any);

      jest
        .spyOn(stepsService, 'findTimeSlotPerUser')
        .mockImplementation(() => Promise.resolve(timeSlots));

      jest
        .spyOn(stepsService, 'rankCommonTimeSlots')
        .mockImplementation(() => rankedTimeSlots as any);

      jest
        .spyOn(stepsService, 'findDestinationAvg')
        .mockImplementation(() => Promise.resolve(bestDestinations));

      jest
        .spyOn(stepsService, 'createStep')
        .mockImplementation(() => Promise.resolve(stepCreated) as any);

      jest
        .spyOn(eventsService, 'update')
        .mockImplementation(() => Promise.resolve(eventUpdated) as any);

      expect(await controller.findBestOptions(event._id)).toBe(stepCreated);
    });
  });

  describe('findOne step', () => {
    it('should return a step', async () => {
      const eventFound = mockdata.findBestOptions.stepCreated;

      jest
        .spyOn(stepsService, 'findOne')
        .mockImplementation(() => Promise.resolve(eventFound) as any);

      expect(await controller.findOne('abc')).toBe(eventFound);
    });
  });
});
