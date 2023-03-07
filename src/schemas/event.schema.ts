import mongoose, { Schema } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';

export const EventSchema = new mongoose.Schema<IEvent>({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  minDuration: Schema.Types.Number,
  maxDuration: Schema.Types.Number,
  participants: [
    {
      id: Schema.Types.ObjectId,
      name: {
        type: Schema.Types.String,
        required: true,
      },
      destinations: [
        {
          name: Schema.Types.String,
          votes: [
            {
              participant: Schema.Types.ObjectId,
              note: Schema.Types.Number,
            },
          ],
        },
      ],
      timeSlots: [
        {
          startDate: Schema.Types.Date,
          endDate: Schema.Types.Date,
        },
      ],
    },
  ],
});
