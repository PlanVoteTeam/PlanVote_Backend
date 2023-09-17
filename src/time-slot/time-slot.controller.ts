import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';

@Controller('events/:eventId/participants/:participantId/timeSlots')
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post()
  async create(
    @Param('eventId') eventId: string,
    @Param('participantId') participantId: string,
    @Body() createTimeSlotDto: CreateTimeSlotDto,
  ) {
    return this.timeSlotService.create(
      eventId,
      participantId,
      createTimeSlotDto,
    );
  }

  @Get()
  async findAll(
    @Param('eventId') eventId: string,
    @Param('participantId') participantId: string,
  ) {
    return this.timeSlotService.findAll(eventId, participantId);
  }

  @Delete(':id')
  async remove(
    @Param('eventId') eventId: string,
    @Param('participantId') participantId: string,
    @Param('id') timeSlotId: string,
  ) {
    return this.timeSlotService.remove(eventId, participantId, timeSlotId);
  }
}
