import dayjs from 'dayjs';

import { Interval } from '@/types';

export const getAvailableAppointments = (
  slotDuration: number,
  intervalList: Interval[],
) =>
  intervalList
    .flatMap((interval: Interval) => {
      const listTime = [];

      const totalIntervals = Math.floor(
        dayjs(interval.to, 'HH:mm').diff(
          dayjs(interval.from, 'HH:mm').add(slotDuration, 'minute'),
          'minute',
        ) / slotDuration,
      );

      for (let i = 0; i <= totalIntervals; i++) {
        listTime.push(
          dayjs(interval.from, 'HH:mm')
            .add(i * slotDuration, 'minute')
            .format('HH:mm'),
        );
      }

      return listTime;
    })
    .map((time) => dayjs(time, 'HH:mm').format('hh:mm A'));

export const checkIsBeforeTime = (time1: string, time2: string) =>
  dayjs(time1, 'HH:mm').isBefore(dayjs(time2, 'HH:mm'));

// two scenarios: to of this interval is coincide with from of other interval , from to of this interval contains from to of other interval
export const isCoincideBetweenInterval = (
  interval: Interval,
  currentInterval: Interval,
) =>
  (checkIsBeforeTime(currentInterval.to, interval.to) &&
    checkIsBeforeTime(interval.from, currentInterval.to)) ||
  (checkIsBeforeTime(interval.to, currentInterval.to) &&
    checkIsBeforeTime(currentInterval.from, interval.to)) ||
  (checkIsBeforeTime(currentInterval.from, interval.from) &&
    checkIsBeforeTime(interval.to, currentInterval.to));

export const isListDateContainThisDate = (listDate: number[], date: Date) =>
  listDate.filter((interval) => interval === date.getDay()).length > 0;
