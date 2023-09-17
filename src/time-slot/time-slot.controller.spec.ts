import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { ITimeSlot } from 'src/events/interfaces/time-slot.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ERROR_CODE_EVENT_OR_PARTICIPANT_NOT_FOUND,
  ERROR_CODE_INVALID_DATE_TIME_SLOT,
  ERROR_CODE_MISSING_DATE_TIME_SLOT,
} from './time-slot.error-code';
import {
  ERROR_MESSAGE_EVENT_OR_PARTICIPANT_NOT_FOUND,
  ERROR_MESSAGE_INVALID_DATE_TIME_SLOT,
  ERROR_MESSAGE_MISSING_DATE_TIME_SLOT,
} from './time-slot.error-message';
import { IEvent } from 'src/events/interfaces/event.interface';

describe('TimeSlotController', () => {
  let controller: TimeSlotController;
  let service: TimeSlotService;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: Model,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSlotController],
      providers: [...mockMongooseTokens, TimeSlotService],
    }).compile();

    controller = module.get<TimeSlotController>(TimeSlotController);
    service = module.get<TimeSlotService>(TimeSlotService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Add a time slot', () => {
    const eventId = '640716fa3d8b5694b431eaa7';
    const correctParticipantId = '640716ff3d8b5694b431eaaa';
    const incorrectParticipantId = '640716ff3d8b5694b431eaab';
    it('should return all the users time slots', async () => {
      const body: CreateTimeSlotDto = {
        startDate: '2024-03-20',
        endDate: '2024-04-10',
      };
      const usersTimeSlots: ITimeSlot[] = [
        {
          startDate: '2024-04-10',
          endDate: '2024-04-10',
          _id: '6422efa8bad3b17502ed2bb2',
        },
      ];

      jest.spyOn(service, 'create').mockResolvedValueOnce(usersTimeSlots);
      expect(
        await controller.create(eventId, correctParticipantId, body),
      ).toStrictEqual(usersTimeSlots);
    });
    it('should throw an exception', async () => {
      const createDestinationDto: any = {
        startDate: new Date('2024-03-20'),
      };
      jest.spyOn(service, 'create').mockRejectedValue(
        new BadRequestException({
          errorCode: ERROR_CODE_MISSING_DATE_TIME_SLOT,
          errorMessage: ERROR_MESSAGE_MISSING_DATE_TIME_SLOT,
        }),
      );
      expect(
        controller.create(
          eventId,
          incorrectParticipantId,
          createDestinationDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw an exception', async () => {
      const createDestinationDto: any = {
        startDate: new Date('2024-04-10'),
        endDate: new Date('2024-03-20'),
      };
      jest.spyOn(service, 'create').mockRejectedValue(
        new BadRequestException({
          errorCode: ERROR_CODE_INVALID_DATE_TIME_SLOT,
          errorMessage: ERROR_MESSAGE_INVALID_DATE_TIME_SLOT,
        }),
      );
      expect(
        controller.create(
          eventId,
          incorrectParticipantId,
          createDestinationDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Find all destinations of a user', () => {
    const eventId = '640716fa3d8b5694b431eaa7';
    const participantId = '640716ff3d8b5694b431eaaa';
    it('should return all the users time slots', async () => {
      const allTimeSlots = [
        {
          startDate: '2023-05-03T00:00:00.000Z',
          endDate: '2023-05-09T00:00:00.000Z',
          _id: '650714bd8568d4d6e5138553',
        },
        {
          startDate: '2023-05-11T00:00:00.000Z',
          endDate: '2023-05-13T00:00:00.000Z',
          _id: '65071c2421d775f84d225528',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(allTimeSlots);
      expect(await controller.findAll(eventId, participantId)).toBe(
        allTimeSlots,
      );
    });
    it('should throw an exception', async () => {
      jest.spyOn(service, 'findAll').mockRejectedValue(
        new NotFoundException({
          errorCode: ERROR_CODE_EVENT_OR_PARTICIPANT_NOT_FOUND,
          errorMessage: ERROR_MESSAGE_EVENT_OR_PARTICIPANT_NOT_FOUND,
        }),
      );
      expect(controller.findAll(eventId, participantId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Delete a time slot', () => {
    const eventId = '640716fa3d8b5694b431eaa7';
    const participantId = '640716ff3d8b5694b431eaaa';
    const timeslotId = '6422efa8bad3b17502ed2bb2';
    it('should return the updated event', async () => {
      const eventUpdated: IEvent = {
        _id: '1',
        description: '',
        name: 'test',
        minDuration: 0,
        maxDuration: 0,
        participants: [],
        step: null,
      };
      jest.spyOn(service, 'remove').mockResolvedValueOnce(eventUpdated);
      expect(
        await controller.remove(eventId, participantId, timeslotId),
      ).toStrictEqual(eventUpdated);
    });
  });
});
