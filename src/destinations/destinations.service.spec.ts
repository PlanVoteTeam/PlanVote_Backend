import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { IDestination } from 'src/events/interfaces/destination.interface';
import { ConflictException } from '@nestjs/common/exceptions';

describe('DestinationsService', () => {
  let service: DestinationsService;

  let modelMock: Model<IEvent>;

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
      providers: [...mockMongooseTokens, DestinationsService],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);
    modelMock = module.get<Model<IEvent>>(getModelToken('Event'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create destination', () => {
    it('should return destination created', async () => {
      const destination: IDestination = {
        name: 'test',
        img: 'test',
        _id: 'a',
      };
      const eventId = '';
      const participantId = '1';
      const createDestinationDto: CreateDestinationDto = {
        name: 'test',
        img: 'test',
      };
      jest.spyOn(modelMock, 'findOne').mockResolvedValueOnce(undefined);
      jest
        .spyOn(modelMock, 'findOneAndUpdate')
        .mockResolvedValueOnce(destination);
      return expect(
        service.create(eventId, participantId, createDestinationDto),
      ).resolves.toStrictEqual(destination);
    });

    it('should throw an error (duplicate)', async () => {
      const destination: IDestination = {
        name: 'test',
        img: 'test',
        _id: 'a',
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
      const eventId = '';
      const participantId = '1';
      const createDestinationDto: CreateDestinationDto = {
        name: 'test',
        img: 'test',
      };
      jest.spyOn(modelMock, 'findOne').mockResolvedValueOnce(event);
      return expect(
        service.create(eventId, participantId, createDestinationDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete destination', () => {
    it('should delete a destination from an event', async () => {
      const eventId = '1';
      const participantId = '1';
      const id = 'a';
      const event: IEvent = {
        _id: '1',
        description: '',
        name: 'test',
        minDuration: 0,
        maxDuration: 0,
        participants: [
          {
            _id: '1',
            name: 'Rémy',
            destinations: [],
            timeSlots: [],
          },
        ],
      };
      jest.spyOn(modelMock, 'findOneAndUpdate').mockResolvedValueOnce(event);
      return expect(
        service.remove(eventId, participantId, id),
      ).resolves.toStrictEqual(event);
    });
  });
});
