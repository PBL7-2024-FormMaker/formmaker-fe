import { Field, FieldArray } from 'formik';

import { TimeInputElement } from '@/types';
import { cn, validateFieldValue, validateLabel } from '@/utils';

import { Text } from '../Text';

import { TimeInput as CustomTimeInput } from './CustomTimeInput';

interface TimeInputProps {
  isReadOnly?: boolean;
  handleOnChangeAnswer: (
    elementId: string,
    fieldId: string,
    value: string,
  ) => void;
  item: TimeInputElement;
}

export const TimeInput = (props: TimeInputProps) => {
  const { isReadOnly = false, item, handleOnChangeAnswer } = props;

  return (
    <FieldArray
      name='timeInput'
      render={() => (
        <div className='flex flex-col gap-2'>
          <Field
            required={item.config.required}
            validate={validateLabel}
            text={item.config.fieldLabel}
            name={`${item.id}.fieldLabel`}
            placeholder='Type a question'
            nameElementField='fieldLabel'
            classNameWrapper='min-h-[40px] mt-4'
            component={Text}
            className={cn('flex min-h-[20px] items-start gap-1', {
              'text-slate-500': !item.config.fieldLabel,
            })}
          />
          <Field
            readOnly={isReadOnly}
            name={`${item.id}.fieldValue`}
            className='min-h-[60px] w-1/2'
            validate={
              !isReadOnly && item.config.required ? validateFieldValue : null
            }
            elementFieldId={item.fields[0].id}
            elementId={item.id}
            handleChange={handleOnChangeAnswer}
            component={CustomTimeInput}
          />
        </div>
      )}
    />
  );
};
