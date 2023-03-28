import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/schemas/event.schema';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';
import { EventsService } from 'src/events/events.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
  ],
  controllers: [StepsController],
  providers: [StepsService, EventsService],
})
export class StepsModule {}
