import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { NotFoundException } from '@nestjs/common/exceptions';
import {
  ERROR_CODE_STEP_NOT_ENOUGH_COMMON_DATES,
  ERROR_MESSAGE_STEP_NOT_ENOUGH_COMMON_DATES,
} from './steps.error';
import { TimeSlotFunctions } from './time-slot-functions';
import { ITimeSlot } from './interfaces/steps.interface';

@Injectable()
export class StepsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}

  async findDestinationAvg(eventId: string) {
    const destinationsAvg = await this.eventModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.destinations',
      },
      {
        $unwind: '$participants.destinations.votes',
      },
      {
        $project: {
          'destinations._id': '$participants.destinations._id',
          'destinations.name': '$participants.destinations.name',
          'destinations.votes': '$participants.destinations.votes',
        },
      },
      {
        $group: {
          _id: '$destinations._id',
          name: {
            $first: '$destinations.name',
          },
          avgNote: {
            $avg: '$destinations.votes.note',
          },
        },
      },

      {
        $sort: {
          avgNote: -1,
        },
      },
      {
        $limit: 3,
      },
    ]);
    return destinationsAvg;
  }

  async findTimeSlotPerUser(eventId: string) {
    const timeSlots = await this.eventModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.timeSlots',
      },
      {
        $project: {
          _id: '$participants.timeSlots._id',
          idParticipant: '$participants._id',
          startDate: '$participants.timeSlots.startDate',
          endDate: '$participants.timeSlots.endDate',
        },
      },
    ]);
    return timeSlots;
  }

  rankCommonTimeSlots(
    timeSlots: ITimeSlot[],
    threshold: number,
    minDays: number,
    maxDays: number,
  ) {
    const timeSlotFunctions = new TimeSlotFunctions(
      timeSlots,
      threshold,
      minDays,
      maxDays,
    );
    const sizedWindows = timeSlotFunctions.main();
    if (sizedWindows.length === 0) {
      throw new NotFoundException({
        sucess: false,
        errorCode: ERROR_CODE_STEP_NOT_ENOUGH_COMMON_DATES,
        errorMessage: ERROR_MESSAGE_STEP_NOT_ENOUGH_COMMON_DATES,
      });
    }
    return sizedWindows;
  }
}
