import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common/exceptions';
import { EVENT_NOT_FOUND_ERROR_CODE } from './events.error-code';
import { EVENT_NOT_FOUND_ERROR_MESSAGE } from './events.error-message';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: Model,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [...mockMongooseTokens, EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create an Event', () => {
    it('should return event created', async () => {
      const eventCreated = new Event();
      const createEventDto: CreateEventDto = {
        name: '',
        minDuration: 0,
        maxDuration: 0,
      };
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(eventCreated));

      expect(await controller.create(createEventDto)).toBe(eventCreated);
    });
  });

  describe('findOne event', () => {
    it('should return an event', async () => {
      const eventFound = new Event();

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(eventFound));

      expect(await controller.findOne('')).toBe(eventFound);
    });

    it('should throw an NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() =>
        Promise.reject(
          new NotFoundException({
            errorCode: EVENT_NOT_FOUND_ERROR_CODE,
            errorMessage: EVENT_NOT_FOUND_ERROR_MESSAGE,
          }),
        ),
      );
      expect(controller.findOne('')).rejects.toThrow(NotFoundException);
    });
  });
});
