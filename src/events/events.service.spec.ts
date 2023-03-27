import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
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
        minDuration: 0,
        maxDuration: 0,
      };
      const eventReturned: IEvent = {
        name: 'test',
        minDuration: 0,
        maxDuration: 0,
      };
      jest
        .spyOn(modelMock, 'create')
        //Le as any permet d'éviter les problèmes de typage Mongoose Document.
        //Donc on peut se permettre de renvoyer n'importe quoi vue que le but ici
        //Est de tester si la logique de la méthode est respecter.
        .mockImplementationOnce(() => Promise.resolve(eventReturned) as any);
      expect(service.create(createEventDto)).resolves.toStrictEqual(
        eventReturned,
      );
    });
  });
});
