import { Stack } from '@mantine/core';
import { Field } from 'formik';

import { useElementLayouts } from '@/contexts';
import { SingleChoiceElement } from '@/types';
import { cn, validateFieldValue, validateLabel } from '@/utils';

import { BaseElementProps } from '../FactoryElement';
import { RadioGroup } from '../RadioGroup';
import { Text } from '../Text';

export const BaseSingleChoiceElement = (
  props: BaseElementProps<SingleChoiceElement>,
) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  return (
    <Stack className='w-full justify-between gap-2.5'>
      <Field
        name={`${item.id}.fieldLabel`}
        placeholder='Type a question'
        required={item.config.required}
        validate={validateLabel}
        component={Text}
        text={item.config.fieldLabel}
        classNameWrapper='min-h-[40px]'
        className={cn('flex min-h-[20px] items-start gap-1', {
          'text-slate-500': !item.config.fieldLabel,
        })}
      />
      <Field
        readOnly={isReadOnly}
        name={`${item.fields[0].id}.fieldValue`}
        validate={
          !isReadOnly && item.config.required ? validateFieldValue : null
        }
        handleChange={handleOnChangeAnswer}
        elementFieldId={item.fields[0].id}
        elementId={item.id}
        component={RadioGroup}
        value={item.fields[0].text}
        classNameWrapper='min-h-[60px]'
        item={item}
      />
    </Stack>
  );
};
