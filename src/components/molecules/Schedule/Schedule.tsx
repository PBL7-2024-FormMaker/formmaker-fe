import { useMemo } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { ActionIcon, Grid } from '@mantine/core';
import dayjs from 'dayjs';

import { Button } from '@/atoms/Button';

interface ScheduleProps {
  date: Date;
  listTime: string[];
  setPreviousDate: () => void;
  setNextDate: () => void;
}

export const Schedule = (props: ScheduleProps) => {
  const { date, listTime, setPreviousDate, setNextDate } = props;
  const formattedDate = useMemo(
    () => dayjs(date).format('dddd, MMMM DD'),
    [date],
  );

  return (
    <div className='h-72 w-56'>
      <div className='mb-2  flex items-center justify-between'>
        <span>{formattedDate}</span>
        <div className='flex gap-2'>
          <ActionIcon onClick={setPreviousDate}>
            <IoIosArrowRoundBack />
          </ActionIcon>
          <ActionIcon onClick={setNextDate}>
            <IoIosArrowRoundForward />
          </ActionIcon>
        </div>
      </div>
      <Grid className='h-full w-full overflow-y-auto overflow-x-hidden'>
        {listTime.map((item, index) => (
          <Grid.Col span={6} key={index}>
            <Button
              key={index}
              variant='outline'
              title={item}
              disabled={true}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
