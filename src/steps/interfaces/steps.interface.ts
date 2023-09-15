export interface ITimeSlot {
  _id: string;
  startDate: Date;
  endDate: Date;
  idParticipant: string;
}

export interface IDay {
  day: Date;
  numberUser: number;
  ids: string[];
}

export interface IWindow {
  id: number;
  commonUsers: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface ISizedWindow {
  size: number;
  maxCommonUser: number;
  windows: IWindow[];
}

export interface DestinationAvg {
  _id: string;
  _name: string;
  avgNote: number;
}

export interface IStep {
  _id: string;
  bestDestinations: DestinationAvg[];
  glidingWindows: ISizedWindow[];
}
