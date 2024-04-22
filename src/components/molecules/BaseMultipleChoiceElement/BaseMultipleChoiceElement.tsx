import { Box, Group } from '@mantine/core';
import { Field } from 'formik';

import { useElementLayouts } from '@/contexts';
import { MultipleChoiceElement } from '@/types';
import { cn, validateFieldValue, validateLabel } from '@/utils';

import { CheckboxGroup } from '../CheckboxGroup';
import { BaseElementProps } from '../FactoryElement';
import { Text } from '../Text';

export const BaseMultipleChoiceElement = (
  props: BaseElementProps<MultipleChoiceElement>,
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
          classNameWrapper='min-h-[40px]'
          className={cn('flex min-h-[20px] items-start gap-1', {
            'text-slate-500': !item.config.fieldLabel,
          })}
        />
        <Field
          name={`${item.fields[0].id}.fieldValue`}
          readOnly={isReadOnly}
          validate={
            !isReadOnly && item.config.required ? validateFieldValue : null
          }
          handleChange={handleOnChangeAnswer}
          elementFieldId={item.fields[0].id}
          elementId={item.id}
          component={CheckboxGroup}
          classNameWrapper='min-h-[60px]'
          item={item}
        />
      </Box>
    </Group>
  );
};
