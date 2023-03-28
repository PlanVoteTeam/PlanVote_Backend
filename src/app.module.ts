import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { ParticipantsModule } from './participants/participants.module';
import { DestinationsModule } from './destinations/destinations.module';
import { VotesModule } from './votes/votes.module';
import { TimeSlotModule } from './time-slot/time-slot.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { StepsModule } from './steps/steps.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 3,
      },
    ]),
    EventsModule,
    ParticipantsModule,
    DestinationsModule,
    VotesModule,
    TimeSlotModule,
    StepsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
