export interface IParticipantWithTimeSlots {
  _id: string;
  timeSlots: ITimeSlotDuration[];
}

export interface ITimeSlotDuration {
  _id: string;
  startDate: Date;
  endDate: Date;
  duration: number;
}

export interface IDestinationAvg {
  _id: string;
  name: string;
  avgNote: number;
}
