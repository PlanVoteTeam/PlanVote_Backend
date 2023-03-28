import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IEvent } from 'src/events/interfaces/event.interface';
import {
  IParticipantWithTimeSlots,
  ITimeSlotDuration,
} from './interfaces/steps.interface';
import {
  PayloadTooLargeException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import {
  ERROR_CODE_STEP_NOT_ENOUGH_COMMON_DATES,
  ERROR_CODE_STEP_TOO_MUCH_DAYS,
  ERROR_MESSAGE_STEP_NOT_ENOUGH_COMMON_DATES,
  ERROR_MESSAGE_STEP_TOO_MUCH_DAYS,
} from './steps.error';

@Injectable()
export class StepsService {
  constructor(@InjectModel('Event') private eventModel: Model<IEvent>) {}

  async findDestinationAvg(eventId: string) {
    const destinationsAvg = await this.eventModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.destinations',
      },
      {
        $unwind: '$participants.destinations.votes',
      },
      {
        $project: {
          'destinations._id': '$participants.destinations._id',
          'destinations.name': '$participants.destinations.name',
          'destinations.votes': '$participants.destinations.votes',
        },
      },
      {
        $group: {
          _id: '$destinations._id',
          name: {
            $first: '$destinations.name',
          },
          avgNote: {
            $avg: '$destinations.votes.note',
          },
        },
      },

      {
        $sort: {
          avgNote: -1,
        },
      },
      {
        $limit: 3,
      },
    ]);
    return destinationsAvg;
  }

  async findTimeSlotPerUser(eventId: string) {
    const timeSlots = await this.eventModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.timeSlots',
      },
      {
        $project: {
          timeSlots: '$participants.timeSlots',
          participantId: '$participants._id',
        },
      },
      {
        $addFields: {
          'timeSlots.duration': {
            $dateDiff: {
              startDate: '$timeSlots.startDate',
              endDate: '$timeSlots.endDate',
              unit: 'day',
            },
          },
        },
      },
      {
        $group: {
          _id: '$participantId',
          timeSlots: { $push: '$timeSlots' },
        },
      },
    ]);
    return timeSlots;
  }

  // https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgJIAU5TMBwAOc4yA3gFDKXID6wAJgFzIDOYUoA5gNwVU4C2EAMoAbAPZhmTVABVgg0RIDaAXR4BfMqEixEKWfOHiwpXrUYs2nHpVZYwAETiQmTyDeQQQdNxFfOIDzoAVyhnYDEQJhBg-gAjaA0yMgRI1mRCbFwCIklpTCy8QnBVZABeZCVeSnIqOpp6JgAiADYAFgAGAHYARi6ADjo2gGYWgE4YBGGOtog6GAAmGAgepoAaavqBIwkpSs36qlrDk8pzZAZWtoXprsQ4uDphuL6AVg6FuYWEPvWD06odmwvmiEAA7shfAAKJoLD7DAC0HURCzaMg6HQYGKxHQAdBiOgAtJoASg2AJOXh8AQuyBA4MhARhcJuSLaSOG6Mx2Ix+IxxLJ-wpITCOEiTB6HSF9U0pxUm3U5KO0vMzXaCwWcWGnymPQQdB6gxeEFeMBgbTof1O20UeX2FJq0tO50u6tebWWcX6EBWPTm7r9PQtfqtDrqQMcAVBEOhsPhHIRCxaXJxOL5RNJSrDlCpvlp9JjTLjrJmCMlKZ5eIJAqz2ZF4XFyB6rydVFlJ3ldUVm2Oh1VyCu3R6LTNwzo-Tir3GbTiIz9cAXocONuMeyqYd72ZdVw1EHgE8ezzeHy+cTiCyX2YjILpDNjLMRyMTXQr3Kr-MzrcOuZp0cZkGZeNS3LSs02rT9syoesxSiZApTDbsNy-eptzdD0IC9H0ej9OgAxWYMIEvMNryjW9CwA4tHxRF9QN5cDBUgnNvDzP97yAlExlfMCPwYxjoIiWCFmQ9tDk7NsNjUZJUhAdIV12aQ5AUYxSgqTIcCKXJmFxKA5mCJAAB4AEEoDCABPfSDCUiQAD5rKhKFEAQNZkAANzgEQSXKazkEc3FpIQZwoTckRcTkyQyVUEkyDCrTmDEbB7LgZy4k8spvLgXESMgXEOAgMBFIgKFPIRZA4kysB7F8HK8oKoqSR4aT0hgYAoFYPMKhipQOhUcrKoCBq0hMEQ4DamkOsMW1YvisBEuS1LvLKn9sty-LDCK5ASoypaIGq1bBDqrqeu2gaZJMOgAgcYAzXKZAoWG0blpqtbPI2yhmtayNHr2wqSRJAB6fp2gJDFKB4K6oXOyBLuu-Sm2BklN0as64FMvYYniaAVMqSS6hEPLkGAG6Og8N74qhQmymJgnYchiBoZgLgCYAaiZhHpXO1HcXwYJmAAC3JqKu02P6ACpNhkAB5BwJc2IR8dp5hkDAMRkDoYBmHwSJgDiYARGAMBTNVlHNhFv7NiRjJ7GyYpI1Rm7VGSOo1OtzTcRgeKAFFEH5jIvNMBV6uSc3BuQfgxAQABrAp1JycBmCcO2KnXE4SCaBWmiYLq1g6bPc56NZ8-znOi9znPi4LivusQlO04CZgM8qMvS4rwu85byuO6LlRq8OVP08zpum9bkvW-L8uS6r2s6j7uuG6zwf24ntuR7byfpRnyB64H5vx473eV9H7up6OWvN7n0fl8Xq+h8ro-19PiAt8bnfr9f-fs7vzYxMoC2OeYGQJDuUuhrLWOs9YGxun-Hgmw-5u09t7eyjB0YJCgPNUwpw8YmGVhVEQhk3K6zgGA-WhsKjE2lGHSO0cXZxwTlpd2UAvYIH5vgP2m5Tjg3wLiBWSg6AqHKGUCoPRPLYPcnguABCiEGxZiTGUgsTh-wATg4BmsQDa11sQnhfCOqANwfg4akjTIyPUIHOoFt+CgCEPIYIIgKr0jEDzAAqswaAN1XgyLMaAWhN0FiM2DqdUOcAAAeXiKhdHcWkMQeNcTiA4BDFG-8dHKNAeog2gdHZUAtmEEAuVFZJxxlQTByAEChB0uAAASkQXKN0SARiYDnTw3gJTOWYLEJgCjEnqxUWo8BplDrqGgXUeht1CkUybIzQmNN4mKKAZ05JPToleA4GAXm4yWaeTYVQcG7SlGzNUQYpQwA+HWQqOYkAlj+DWNsRAexzAnHQDZmGYpJkvBgAqdknaVJpHISeaU15lSdotP4MgJmFRtkzJAXslJvTDmMyoNKdQEARDOI2YcH5Ly3m5V6tgYFZQegyNOJk-5DhQgNhADdNF5T-m4ipK9Clfz3lYrAPik4dKMUfO8BtXFzLUURKiTEqEWTcrEtFAJExDpwasqpYC5Af1kCCrpiSmCyBjmhwsVYmxRBrmOOcVAZAAAyPVcqiWKoEsqk5nj4n6sNfK4VpLkD6ROUE2hDzGLyq0tzPmUJJXvPqnUYS3ySnov+dU2pBNnJUiYMAJm+cWCtLgiJGUCo-HpDDqwdA1z8B4zZbko17ypoJQcnNP2ZVpWbUyrEQOmggA
  calculateCommonTimeSlots(
    participants: IParticipantWithTimeSlots[],
    minDays: number,
    maxDays: number,
  ) {
    // find the earliest and latest date
    const timeSlots: ITimeSlotDuration[] = participants.reduce<
      Array<ITimeSlotDuration>
    >((acc, val: IParticipantWithTimeSlots) => acc.concat(val.timeSlots), []);
    timeSlots.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const firstDate = timeSlots[0].startDate;
    const lastDate = timeSlots.sort(
      (a, b) => b.endDate.getTime() - a.endDate.getTime(),
    )[0].endDate;
    const dateDiff = (lastDate.getTime() - firstDate.getTime()) / 86400000;
    // console.log(dateDiff);
    if (dateDiff < 10000) {
      const days: number[] = [];
      let i = 0;
      for (i = 0; i < dateDiff; i++) {
        days.push(i);
      }
      // concatenate participants disponibilities in arrays
      const participantDays: any = [];
      participants.forEach((p) => {
        const pDays: any = [];
        let shouldContinue = 0;
        if (p.timeSlots.length) {
          days.forEach((d) => {
            if (shouldContinue == 0) {
              p.timeSlots.find((t) => {
                const readDate = new Date(firstDate);
                if (
                  t.startDate.getTime() ===
                  readDate.setTime(readDate.getTime() + d * 86400000)
                ) {
                  // console.log(t.duration);
                  for (i = 0; i <= t.duration; i++) pDays.push(1);
                  shouldContinue = t.duration;
                } else {
                  pDays.push(0);
                }
              });
            } else {
              shouldContinue -= 1;
            }
          });
        }
        /* 
              Gérer cas où x timeslots simultanés ? Merge à faire avec disponibilité = 1
        */
        participantDays.push({ dates: pDays });
      });

      //compile the results in a new tab for availability
      const daysTotalDisponibility = days;
      days.forEach((d: number) => {
        let totalAvailability = 0;
        participantDays.forEach((p) => {
          if (p.dates[d] === 1) totalAvailability++;
        });
        daysTotalDisponibility[d] = totalAvailability;
      });
      const minSimultaneousUser = participants.length * 0.7;
      // console.log(daysTotalDisponibility);

      const ranges = [];
      let currentRange = { start: 0, end: 1, sum: daysTotalDisponibility[0] };
      // find ranges where 70% of participants are available
      for (let i = 1; i < daysTotalDisponibility.length; i++) {
        if (daysTotalDisponibility[i] >= minSimultaneousUser) {
          currentRange.end++;
          currentRange.sum += daysTotalDisponibility[i];
        } else {
          currentRange.start += 1;
          const rangeDuration = currentRange.end - currentRange.start;
          currentRange.end -= 1;
          if (
            currentRange.sum / rangeDuration >= minSimultaneousUser &&
            rangeDuration >= minDays &&
            rangeDuration <= maxDays
          ) {
            ranges.push(currentRange);
          }
          currentRange = { start: i, end: i + 1, sum: 0 };
        }
      }
      //set numbers of days to dates
      ranges.forEach((r) => {
        const currentDate = new Date(firstDate);
        r.duration = r.end - r.start;
        r.start = new Date(
          new Date().setTime(currentDate.getTime() + r.start * 86400000),
        );
        r.end = new Date(
          new Date().setTime(currentDate.getTime() + r.end * 86400000),
        );
      });
      const mostPeopleRanges = ranges.sort((a, b) => b.sum - a.sum);
      if (mostPeopleRanges.length <= 0) {
        throw new NotFoundException({
          sucess: false,
          errorCode: ERROR_CODE_STEP_NOT_ENOUGH_COMMON_DATES,
          errorMessage: ERROR_MESSAGE_STEP_NOT_ENOUGH_COMMON_DATES,
        });
      }
      return mostPeopleRanges;
    } else {
      throw new PayloadTooLargeException({
        sucess: false,
        errorCode: ERROR_CODE_STEP_TOO_MUCH_DAYS,
        errorMessage: ERROR_MESSAGE_STEP_TOO_MUCH_DAYS,
      });
    }
  }
}
