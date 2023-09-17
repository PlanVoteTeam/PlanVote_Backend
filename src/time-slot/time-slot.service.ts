import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { IParticipant } from 'src/events/interfaces/participant.interface';
import {
  ITimeSlot,
  ITimeSlotFound,
} from 'src/events/interfaces/time-slot.interface';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
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

@Injectable()
export class TimeSlotService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}
  async create(
    eventId: string,
    participantId: string,
    createTimeSlotDto: CreateTimeSlotDto,
  ): Promise<ITimeSlot[]> {
    if (!createTimeSlotDto.startDate || !createTimeSlotDto.endDate) {
      throw new BadRequestException({
        success: false,
        errorCode: ERROR_CODE_MISSING_DATE_TIME_SLOT,
        errorMessage: ERROR_MESSAGE_MISSING_DATE_TIME_SLOT,
      });
    }

    if (createTimeSlotDto.startDate > createTimeSlotDto.endDate) {
      throw new BadRequestException({
        success: false,
        errorCode: ERROR_CODE_INVALID_DATE_TIME_SLOT,
        errorMessage: ERROR_MESSAGE_INVALID_DATE_TIME_SLOT,
      });
    }
    const timeSlotCreated = await this.eventModel.findOneAndUpdate(
      { _id: eventId, 'participants._id': participantId },
      {
        $push: {
          'participants.$.timeSlots': createTimeSlotDto,
        },
      },
      {
        new: true,
      },
    );
    const timeSlots = timeSlotCreated.participants.filter(
      (participant: IParticipant) =>
        participant._id.toString() === participantId,
    )[0].timeSlots;

    return timeSlots;
  }

  async findAll(eventId: string, participantId: string): Promise<ITimeSlot[]> {
    const timeslotsFound: ITimeSlotFound[] = await this.eventModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $unwind: '$participants',
      },
      {
        $match: {
          'participants._id': new mongoose.Types.ObjectId(participantId),
        },
      },
      {
        $project: {
          timeSlots: '$participants.timeSlots',
        },
      },
    ]);
    if (timeslotsFound.length > 0) {
      if (timeslotsFound[0].timeSlots.length > 0) {
        return timeslotsFound[0].timeSlots;
      } else {
        return [];
      }
    } else {
      throw new NotFoundException({
        success: false,
        errorCode: ERROR_CODE_EVENT_OR_PARTICIPANT_NOT_FOUND,
        errorMessage: ERROR_MESSAGE_EVENT_OR_PARTICIPANT_NOT_FOUND,
      });
    }
  }

  async remove(
    eventId: string,
    participantId: string,
    timeSlotId: string,
  ): Promise<IEvent> {
    const eventUpdated = await this.eventModel.findOneAndUpdate(
      {
        _id: eventId,
        'participants._id': participantId,
      },
      {
        $pull: {
          'participants.$.timeSlots': { _id: timeSlotId },
        },
      },
      {
        new: true,
      },
    );

    return {
      _id: eventUpdated._id,
      name: eventUpdated.name,
      description: eventUpdated.description,
      minDuration: eventUpdated.minDuration,
      maxDuration: eventUpdated.maxDuration,
      participants: eventUpdated.participants,
      step: eventUpdated.step,
    };
  }
}
