import { useMemo, useState } from 'react';
import { Indicator, Text } from '@mantine/core';
import { Calendar as CalendarMantine } from '@mantine/dates';
import dayjs from 'dayjs';

import { Schedule } from '@/molecules/Schedule/Schedule';
import { AppointmentSettings, Interval } from '@/types/appointment';
import {
  checkIsBeforeTime,
  getAvailableAppointments,
  isCoincideBetweenInterval,
  isListDateContainThisDate,
} from '@/utils';

interface AppointmentProps {
  schedules: AppointmentSettings;
}

export const Appointment = (props: AppointmentProps) => {
  const { schedules } = props;
  const [date, setDate] = useState<Date>(new Date());
  const handleSetPreviousDate = () => {
    const previousDate = dayjs(date).subtract(1, 'day').toDate();
    setDate(previousDate);
  };
  const handleSetNextDate = () => {
    const nextDate = dayjs(date).add(1, 'day').toDate();
    setDate(nextDate);
  };
  const convertNotCoincideIntervalList = (intervalList: Interval[]) =>
    intervalList
      .sort((a, b) => (checkIsBeforeTime(a.from, b.from) ? -1 : 1))
      .reduce((accumulator: Interval[], currentInterval: Interval) => {
        const index = accumulator.findIndex((interval) =>
          isCoincideBetweenInterval(interval, currentInterval),
        );
        if (index === -1) return [...accumulator, currentInterval];
        accumulator[index] = {
          from: checkIsBeforeTime(accumulator[index].from, currentInterval.from)
            ? accumulator[index].from
            : currentInterval.from,
          to: checkIsBeforeTime(accumulator[index].to, currentInterval.to)
            ? currentInterval.to
            : accumulator[index].to,
        };
        return accumulator;
      }, []);

  const intervalList = useMemo(
    () =>
      convertNotCoincideIntervalList(
        schedules.intervalDateList
          .filter((intervalDate) =>
            isListDateContainThisDate(intervalDate.listDate, date),
          )
          .flatMap((intervalDate) => intervalDate.intervalList),
      ),
    [schedules.intervalDateList, date],
  );
  const listTime = useMemo(
    () => getAvailableAppointments(schedules.slotDuration, intervalList),
    [intervalList, schedules.slotDuration],
  );

  return (
    <div className='flex flex-col'>
      <Text>Appointment</Text>
      <div className='flex gap-3'>
        <CalendarMantine
          date={date}
          onPreviousMonth={() =>
            setDate(dayjs(date).subtract(1, 'month').toDate())
          }
          onNextMonth={() => setDate(dayjs(date).add(1, 'month').toDate())}
          getDayProps={(date) => ({
            onClick: () => {
              setDate(date);
            },
          })}
          renderDay={(dateParam) => {
            const day = dateParam.getDate();
            return (
              <Indicator
                size={6}
                color='red'
                offset={-2}
                disabled={day !== date.getDate()}
              >
                <div>{day}</div>
              </Indicator>
            );
          }}
        />
        <Schedule
          date={date}
          listTime={listTime}
          setPreviousDate={handleSetPreviousDate}
          setNextDate={handleSetNextDate}
        />
      </div>
    </div>
  );
};
