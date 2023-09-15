import mongoose, { Schema } from 'mongoose';
import { IStep } from 'src/steps/interfaces/steps.interface';

export const StepSchema = new mongoose.Schema<IStep>({
  bestDestinations: [
    {
      _id: Schema.Types.String,
      name: Schema.Types.String,
      avgNote: Schema.Types.Number,
    },
  ],
  glidingWindows: [
    {
      size: Schema.Types.Number,
      maxCommonUser: Schema.Types.Number,
      windows: [
        {
          commonUsers: [Schema.Types.String],
          startDate: Schema.Types.Date,
          endDate: Schema.Types.Date,
        },
      ],
    },
  ],
});
