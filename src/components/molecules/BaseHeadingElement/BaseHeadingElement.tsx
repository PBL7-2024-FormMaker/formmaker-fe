import { Box, Group } from '@mantine/core';
import { Field } from 'formik';

import { HeadingElement } from '@/types';
import { cn, validateLabel } from '@/utils';

import { BaseElementProps } from '../FactoryElement';
import { Text } from '../Text';

export const BaseHeadingElement = (props: BaseElementProps<HeadingElement>) => {
  const { item } = props;

  return (
    <Group className='justify-between'>
      <Box className='w-full'>
        <Field
          name={`${item.id}.headingText`}
          text={item.config.headingText}
          placeholder='Type a question'
          validate={validateLabel}
          component={Text}
          classNameWrapper='min-h-[45px] mt-2'
          className={cn(
            'flex min-h-[20px] items-start gap-1 text-2xl font-bold',
            {
              'text-slate-500': !item.config.headingText,
            },
          )}
        />
        <Field
          name={`${item.id}.subheadingText`}
          text={item.config.subheadingText}
          placeholder='Type a subheading'
          validate={validateLabel}
          component={Text}
          classNameWrapper='min-h-[42px]'
          className={cn(
            'flex min-h-[20px] items-start gap-1 text-[13px] text-slate-500',
            {
              'text-slate-400': !item.config.subheadingText,
            },
          )}
        />
      </Box>
    </Group>
  );
};
