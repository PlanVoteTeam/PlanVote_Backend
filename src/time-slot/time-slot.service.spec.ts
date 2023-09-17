import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotService } from './time-slot.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { ITimeSlot } from 'src/events/interfaces/time-slot.interface';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';

describe('TimeSlotService', () => {
  let service: TimeSlotService;
  let modelMock: Model<IEvent>;

  const mockMongooseTokens = [
    {
      provide: getModelToken('Event'),
      useValue: {
        findOneAndUpdate: jest.fn(),
        aggregate: jest.fn(),
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...mockMongooseTokens, TimeSlotService],
    }).compile();

    service = module.get<TimeSlotService>(TimeSlotService);
    modelMock = module.get<Model<IEvent>>(getModelToken('Event'));
  });

  it('create time slot', () => {
    const body: CreateTimeSlotDto = {
      startDate: '2024-03-20',
      endDate: '2024-04-10',
    };

    const resolved: IEvent = {
      _id: '',
      name: '',
      minDuration: 7,
      maxDuration: 7,
      participants: [
        {
          _id: '',
          name: 'test',
          destinations: [],
          timeSlots: [
            {
              startDate: '2024-04-10',
              endDate: '2024-04-10',
              _id: '6422efa8bad3b17502ed2bb2',
            },
          ],
        },
      ],
    };
    const usersTimeSlots: ITimeSlot[] = [
      {
        startDate: '2024-04-10',
        endDate: '2024-04-10',
        _id: '6422efa8bad3b17502ed2bb2',
      },
    ];

    jest.spyOn(modelMock, 'findOneAndUpdate').mockResolvedValueOnce(resolved);
    expect(service.create('', '', body)).resolves.toStrictEqual(usersTimeSlots);
  });

  it('find all timeslot for a user in an event', () => {
    const resolve = [
      {
        _id: '',
        timeSlots: [
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
        ],
      },
    ];
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
    jest.spyOn(modelMock, 'aggregate').mockResolvedValue(resolve);
    expect(
      service.findAll('6422efa8bad3b17502ed2bb2', '6422efa8bad3b17502ed2bb3'),
    ).resolves.toStrictEqual(allTimeSlots);
  });

  it('remove a timeslot for a user', () => {
    const resolved: IEvent = {
      _id: '',
      name: '',
      description: undefined,
      minDuration: 7,
      maxDuration: 7,
      participants: [
        {
          _id: '',
          name: 'test',
          destinations: [],
          timeSlots: [],
        },
      ],
      step: undefined,
    };

    jest.spyOn(modelMock, 'findOneAndUpdate').mockResolvedValue(resolved);
    expect(
      service.remove(
        '6422efa8bad3b17502ed2bb2',
        '6422efa8bad3b17502ed2bb3',
        '',
      ),
    ).resolves.toStrictEqual(resolved);
  });
});
