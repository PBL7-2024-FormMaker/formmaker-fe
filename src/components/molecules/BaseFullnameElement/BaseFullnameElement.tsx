import { Box, Group } from '@mantine/core';
import { Field } from 'formik';

import { useElementLayouts } from '@/contexts';
import { FullnameElement } from '@/types';
import { cn, validateFieldValue, validateLabel } from '@/utils';

import { BaseElementProps } from '../FactoryElement';
import { Text } from '../Text';
import { TextInput } from '../TextInput';

export const BaseFullnameElement = (
  props: BaseElementProps<FullnameElement>,
) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  return (
    <Group>
      <Box className='w-full'>
        <Field
          name={`${item.id}.fieldLabel`}
          text={item.config.fieldLabel}
          placeholder='Type a question'
          required={item.config.required}
          validate={validateLabel}
          component={Text}
          classNameWrapper='min-h-[40px] mt-4'
          className={cn('flex min-h-[20px] items-start gap-1', {
            'text-slate-500': !item.config.fieldLabel,
          })}
        />
        <Group className='w-full flex-nowrap items-center justify-between'>
          <Box className='flex w-1/2 flex-col justify-between'>
            <Field
              name={`${item.fields[0].id}.fieldValue`}
              readOnly={isReadOnly}
              validate={
                !isReadOnly && item.config.required ? validateFieldValue : null
              }
              handleChange={handleOnChangeAnswer}
              elementFieldId={item.fields[0].id}
              elementId={item.id}
              component={TextInput}
              value={item.fields[0].text}
              classNameWrapper='min-h-[60px]'
            />
            <Field
              name={`${item.id}.sublabels.firstName`}
              text={item.config.sublabels.firstName}
              placeholder='Type a sublabel'
              validate={validateLabel}
              component={Text}
              classNameWrapper='min-h-[40px]'
              className={cn(
                'flex min-h-[20px] items-start gap-1 text-[13px] text-slate-500',
                {
                  'text-slate-400': !item.config.sublabels.firstName,
                },
              )}
            />
          </Box>
          <Box className='flex w-1/2 flex-col justify-between'>
            <Field
              name={`${item.fields[1].id}.fieldValue`}
              readOnly={isReadOnly}
              validate={
                !isReadOnly && item.config.required ? validateFieldValue : null
              }
              handleChange={handleOnChangeAnswer}
              elementFieldId={item.fields[1].id}
              elementId={item.id}
              component={TextInput}
              value={item.fields[1].text}
              classNameWrapper='min-h-[60px]'
            />
            <Field
              name={`${item.id}.sublabels.lastName`}
              text={item.config.sublabels.lastName}
              placeholder='Type a sublabel'
              validate={validateLabel}
              component={Text}
              classNameWrapper='min-h-[40px]'
              className={cn(
                'flex min-h-[20px] items-start gap-1 text-[13px] text-slate-500',
                {
                  'text-slate-400': !item.config.sublabels.lastName,
                },
              )}
            />
          </Box>
        </Group>
      </Box>
    </Group>
  );
};
