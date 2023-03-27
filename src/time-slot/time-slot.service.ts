import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import { IParticipant } from 'src/events/interfaces/participant.interface';
import { ITimeSlot } from 'src/events/interfaces/time-slot.interface';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import {
  ERROR_CODE_INVALID_DATE_TIME_SLOT,
  ERROR_CODE_MISSING_DATE_TIME_SLOT,
} from './time-slot.error-code';
import {
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

    console.log(timeSlotCreated.participants[0]._id);
    console.log(participantId);

    const timeSlots = timeSlotCreated.participants.filter(
      (participant: IParticipant) =>
        participant._id.toString() === participantId,
    )[0].timeSlots;

    return timeSlots;
  }

  findAll() {
    return `This action returns all timeSlot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeSlot`;
  }

  update(id: number, updateTimeSlotDto: UpdateTimeSlotDto) {
    return `This action updates a #${id} timeSlot`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeSlot`;
  }
}
