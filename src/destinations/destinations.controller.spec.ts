import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { Destination } from './entities/destination.entity';
import { ConflictException } from '@nestjs/common';
import { ERROR_CODE_DESTINATION_ALREADY_EXIST } from './destinations.error-code';
import { ERROR_MESSAGE_DESTINATION_ALREADY_EXIST } from './destinations.error-message';
import { Event } from 'src/events/entities/event.entity';

describe('DestinationsController', () => {
  let controller: DestinationsController;
  let service: DestinationsService;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: Model,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinationsController],
      providers: [...mockMongooseTokens, DestinationsService],
    }).compile();

    controller = module.get<DestinationsController>(DestinationsController);
    service = module.get<DestinationsService>(DestinationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Add a destination', () => {
    it('should return a destination', async () => {
      const destinationCreated = new Destination();
      const eventId = '';
      const participantId = '';
      const createDestinationDto: CreateDestinationDto = {
        name: '',
        img: '',
      };
      jest.spyOn(service, 'create').mockResolvedValue(destinationCreated);
      expect(
        await controller.create(eventId, participantId, createDestinationDto),
      ).toBe(destinationCreated);
    });

    it('should throw an exception', async () => {
      const eventId = '';
      const participantId = '';
      const createDestinationDto: CreateDestinationDto = {
        name: '',
        img: '',
      };
      jest.spyOn(service, 'create').mockRejectedValue(
        new ConflictException({
          errorCode: ERROR_CODE_DESTINATION_ALREADY_EXIST,
          errorMessage: ERROR_MESSAGE_DESTINATION_ALREADY_EXIST,
        }),
      );
      expect(
        controller.create(eventId, participantId, createDestinationDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete a destination', () => {
    it('should delete a destination and return updated event', async () => {
      const eventUpdated: Event = {
        name: '',
        minDuration: 0,
        maxDuration: 0,
        participants: [],
      };
      const eventId = '';
      const participantId = '';
      const body = { id: '' };
      jest.spyOn(service, 'remove').mockResolvedValueOnce(eventUpdated);
      expect(
        await controller.remove(eventId, participantId, body),
      ).toStrictEqual(eventUpdated);
    });
  });
});
