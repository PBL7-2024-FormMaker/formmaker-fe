import { LuCalendarCheck2 } from 'react-icons/lu';
import { Field } from 'formik';

import { Text } from '@/molecules/Text';
import { DatePickerElement } from '@/types';
import { cn, validateFieldValue, validateLabel } from '@/utils';

import { DatePickerInput as DatePickerInputCustom } from '../DatePickerInputCustom';

interface DatePickerInputProps {
  isReadOnly?: boolean;
  handleOnChangeAnswer: (
    elementId: string,
    elementFieldId: string,
    value: string,
  ) => void;
  item: DatePickerElement;
}

export const DatePickerInput = (props: DatePickerInputProps) => {
  const { isReadOnly = false, item, handleOnChangeAnswer } = props;

  return (
    <div className={'flex flex-col gap-2'}>
      <Field
        required={item.config.required}
        validate={validateLabel}
        text={item.config.fieldLabel}
        placeholder='Type a question'
        name={`${item.id}.fieldLabel`}
        component={Text}
        classNameWrapper='min-h-[40px] mt-4'
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
        valueFormat='YYYY MMM DD'
        rightSection={<LuCalendarCheck2 />}
        elementFieldId={item.fields[0].id}
        elementId={item.id}
        handleChange={handleOnChangeAnswer}
        component={DatePickerInputCustom}
      />
      <Field
        validate={validateLabel}
        name={`${item.id}.subLabel`}
        placeholder='Type a sublabel'
        size='xs'
        text={item.config.sublabel}
        component={Text}
        classNameWrapper='min-h-[40px]'
        className={cn(
          'flex min-h-[20px] items-start gap-1 text-[13px] text-slate-500',
          {
            'text-slate-400': !item.config.sublabel,
          },
        )}
      />
    </div>
  );
};
