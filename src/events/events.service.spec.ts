import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { IEvent } from './interfaces/event.interface';

describe('EventsService', () => {
  let service: EventsService;

  let modelMock: Model<IEvent>;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: {
        new: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        findOneAndUpdate: jest.fn(),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...mockMongooseTokens, EventsService],
    }).compile();
    service = module.get<EventsService>(EventsService);
    modelMock = module.get<Model<IEvent>>(getModelToken('Event'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create an Event', () => {
    it('should return event created', async () => {
      const createEventDto: CreateEventDto = {
        name: 'test',
        description: '',
        minDuration: 0,
        maxDuration: 0,
      };
      const eventReturned: IEvent = {
        _id: '',
        name: 'test',
        description: '',
        minDuration: 0,
        maxDuration: 0,
      };
      jest
        .spyOn(modelMock, 'create')
        .mockImplementationOnce(() => Promise.resolve(eventReturned) as any);
      expect(service.create(createEventDto)).resolves.toStrictEqual(
        eventReturned,
      );
    });

    describe('update an Event', () => {
      it('should return event updated', async () => {
        const eventId = '';
        const updateEventDto: UpdateEventDto = {
          name: 'test',
          description: '',
          minDuration: 0,
          maxDuration: 0,
        };
        const eventReturned: IEvent = {
          _id: '',
          name: 'test',
          description: '',
          minDuration: 0,
          maxDuration: 0,
        };
        jest
          .spyOn(modelMock, 'findOneAndUpdate')
          .mockImplementationOnce(() => Promise.resolve(eventReturned) as any);
        expect(service.update(eventId, updateEventDto)).resolves.toStrictEqual(
          eventReturned,
        );
      });
    });
  });
});
