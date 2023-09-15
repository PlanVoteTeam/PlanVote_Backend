import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from 'src/schemas/event.schema';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';
import { EventsService } from 'src/events/events.service';
import { StepSchema } from 'src/schemas/step.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    MongooseModule.forFeature([{ name: 'Step', schema: StepSchema }]),
  ],
  controllers: [StepsController],
  providers: [StepsService, EventsService],
})
export class StepsModule {}
