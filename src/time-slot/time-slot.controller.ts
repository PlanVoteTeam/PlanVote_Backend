import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TimeSlotService } from './time-slot.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeSlotService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeSlotDto: UpdateTimeSlotDto,
  ) {
    return this.timeSlotService.update(+id, updateTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotService.remove(+id);
  }
}
