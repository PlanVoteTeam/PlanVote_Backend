import { PayloadTooLargeException } from '@nestjs/common';
import {
  IWindow,
  ITimeSlot,
  IDay,
  ISizedWindow,
} from './interfaces/steps.interface';
import {
  ERROR_CODE_STEP_TOO_MUCH_DAYS,
  ERROR_MESSAGE_STEP_TOO_MUCH_DAYS,
} from './steps.error';

export class TimeSlotFunctions {
  private minPeople = 0;
  private minDuration = 0;
  private maxDuration = 0;
  private timeSlots: ITimeSlot[];

  // Ajouter des check d'unicité des dates (pas de crénaux qui se chevauchent pour un même utilisateur)
  constructor(
    timeSlots: ITimeSlot[],
    minPeople: number,
    minDuration: number,
    maxDuration: number,
  ) {
    this.timeSlots = timeSlots;
    this.minPeople = minPeople;
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
  }

  public mockTimeSlots = [
    {
      _id: '',
      startDate: new Date('2023-03-24T00:00:00.000Z'),
      endDate: new Date('2023-04-03T00:00:00.000Z'),
      idParticipant: '6407178d4369fc304edf2fe1',
    },
    {
      _id: '',
      startDate: new Date('2023-04-07T00:00:00.000Z'),
      endDate: new Date('2023-04-10T00:00:00.000Z'),
      idParticipant: '6407178d4369fc304edf2fe1',
    },
    {
      _id: '',
      startDate: new Date('2023-03-26T00:00:00.000Z'),
      endDate: new Date('2023-04-10T00:00:00.000Z'),
      idParticipant: '6422b32ec31cd18db1e5ff4d',
    },
    {
      _id: '',
      startDate: new Date('2023-03-24T00:00:00.000Z'),
      endDate: new Date('2023-03-25T00:00:00.000Z'),
      idParticipant: '6422b32ec31cd18db1e5ff4d',
    },
    {
      _id: '',
      startDate: new Date('2023-03-24T00:00:00.000Z'),
      endDate: new Date('2023-03-30T00:00:00.000Z'),
      idParticipant: '6422b32ec31cd18db1e5ff4f',
    },
  ];

  public main() {
    this.timeSlots.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
    const startDate = new Date(
      Math.min(
        ...this.timeSlots.map((slot) => new Date(slot.startDate).getTime()),
      ),
    );
    const endDate = new Date(
      Math.max(
        ...this.timeSlots.map((slot) => new Date(slot.endDate).getTime()),
      ),
    );

    if ((endDate.getTime() - startDate.getTime()) / 86400000 > 1000) {
      throw new PayloadTooLargeException({
        sucess: false,
        errorCode: ERROR_CODE_STEP_TOO_MUCH_DAYS,
        errorMessage: ERROR_MESSAGE_STEP_TOO_MUCH_DAYS,
      });
    }

    const daysList = this.createDaysList(this.timeSlots, startDate, endDate);
    const sizedWindows = this.createSizedWindows(
      this.minDuration,
      this.maxDuration,
      daysList,
    );

    return sizedWindows;
  }

  public findCommonElements(...arrays: Array<any>[]): Array<any> {
    const firstArray = arrays[0];
    const commonElements = firstArray.filter((element) => {
      for (let i = 1; i < arrays.length; i++) {
        if (!arrays[i].includes(element)) {
          return false;
        }
      }
      return true;
    });

    const uniqueElements = new Set(commonElements);
    return Array.from(uniqueElements);
  }

  public getDaysBetweenDates(startDate: Date, endDate: Date): Date[] {
    const days = [];
    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setTime(currentDate.getTime() + 86400000)
    ) {
      days.push(new Date(currentDate));
    }
    return days;
  }

  public createDaysList(
    slots: ITimeSlot[],
    startDate: Date,
    endDate: Date,
  ): IDay[] {
    const days = this.getDaysBetweenDates(startDate, endDate);

    const daysList: IDay[] = days.map((day) => ({
      day,
      numberUser: 0,
      ids: [],
    }));
    for (const slot of slots) {
      const start = new Date(slot.startDate);
      const end = new Date(slot.endDate);

      const startIndex = days.findIndex(
        (day) => day.getTime() === start.getTime(),
      );
      const endIndex = days.findIndex((day) => day.getTime() === end.getTime());

      for (let i = startIndex; i < endIndex; i++) {
        daysList[i].numberUser++;
        daysList[i].ids.push(slot.idParticipant);
      }
    }

    return daysList;
  }

  public createWindows(daysList: IDay[], minDuration: number) {
    const glidingWindows: IDay[][] = [];
    for (let i = 0; i < daysList.length - minDuration + 1; i++) {
      glidingWindows.push(daysList.slice(i, i + minDuration));
    }
    return glidingWindows;
  }

  public filterWindows(windows: IDay[][], minPeople: number) {
    // Step 1 : get common users in each window
    let windowsData: IWindow[] = [];
    windows.forEach((w: any, index: number) => {
      const ids = w.map((x: IDay) => x.ids);
      const commonUsers = this.findCommonElements(...ids);
      windowsData.push({
        id: index,
        startDate: w[0].day,
        endDate: w[w.length - 1].day,
        commonUsers: commonUsers,
      });
    });
    // Step 2 : filter out windows lacking common people
    windowsData = windowsData.filter(
      (w: IWindow) => w.commonUsers.length > minPeople,
    );
    windowsData = windowsData.sort(
      (a: IWindow, b: IWindow) => b.commonUsers.length - a.commonUsers.length,
    );
    return windowsData;
  }

  public createSizedWindows(
    minDuration: number,
    maxDuration: number,
    daysList: IDay[],
  ) {
    const sizedWindows: ISizedWindow[] = [];
    for (let i = minDuration; i <= maxDuration; i++) {
      const windows: IDay[][] = this.createWindows(daysList, i);
      const filteredWindows = this.filterWindows(windows, this.minPeople);
      const maxCommonUser =
        filteredWindows && filteredWindows.length > 0
          ? filteredWindows[0].commonUsers.length
          : 0;

      const sizedWindow: ISizedWindow = {
        size: i,
        maxCommonUser: maxCommonUser,
        windows: filteredWindows,
      };

      sizedWindows.push(sizedWindow);
    }
    return sizedWindows.filter((sw: ISizedWindow) => sw.maxCommonUser > 0);
  }
}
