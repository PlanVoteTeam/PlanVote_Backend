import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { Destination } from './entities/destination.entity';
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
      const destination: Destination = {
        name: 'test',
        img: 'test',
        _id: 'a',
      };
      const event: any = {
        name: 'test',
        minDuration: 0,
        maxDuration: 0,
        participants: [
          {
            _id: '1',
            name: 'Rémy',
            destinations: [destination],
          },
        ],
      };
      const eventId = '';
      const participantId = '1';
      const createDestinationDto: CreateDestinationDto = {
        name: 'test',
        img: 'test',
      };
      jest.spyOn(modelMock, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(modelMock, 'findOneAndUpdate').mockResolvedValueOnce(event);
      expect(
        service.create(eventId, participantId, createDestinationDto),
      ).resolves.toStrictEqual(destination);
    });

    it('should throw an error (duplicate)', async () => {
      const destination: Destination = {
        name: 'test',
        img: 'test',
        _id: 'a',
      };
      const event: any = {
        name: 'test',
        minDuration: 0,
        maxDuration: 0,
        participants: [
          {
            _id: '1',
            name: 'Rémy',
            destinations: [destination],
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
      expect(
        service.create(eventId, participantId, createDestinationDto),
      ).rejects.toThrow(ConflictException);
    });
  });
});
