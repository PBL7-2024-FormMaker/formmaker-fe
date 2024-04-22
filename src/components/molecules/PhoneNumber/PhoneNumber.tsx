import { Field, FieldArray, useField } from 'formik';

import { NumberPhoneElement } from '@/types';
import { cn, validateLabel } from '@/utils';
import { isValidPhoneNumber } from '@/utils/schemas/validation';

import { PhoneNumberInput } from '../PhoneNumberInput';
import { Text } from '../Text';

interface NumberPhoneProps {
  isReadOnly?: boolean;
  item: NumberPhoneElement;
  handleOnChangeAnswer: (
    elementId: string,
    elementFieldId: string,
    value: string,
  ) => void;
}

export const NumberPhone = (props: NumberPhoneProps) => {
  const { isReadOnly = false, item, handleOnChangeAnswer } = props;

  const validatePhoneNumber = async (value: string) =>
    isValidPhoneNumber
      .validate(value)
      .then(() => {})
      .catch((err) => err.errors[0]);
  const [field] = useField(`${item.id}.fieldValue`);

  return (
    <FieldArray
      name='numberPhone'
      render={() => (
        <div className='flex flex-col gap-2'>
          <Field
            required={item.config.required}
            validate={validateLabel}
            placeholder='Type a question'
            text={item.config.fieldLabel}
            name={`${item.id}.fieldLabel`}
            classNameWrapper='min-h-[40px] mt-4'
            component={Text}
            className={cn('flex min-h-[20px] items-start gap-1', {
              'text-slate-500': !item.config.fieldLabel,
            })}
          />
          <Field
            readOnly={isReadOnly}
            name={`${item.id}.fieldValue`}
            classNameWrapper='w-1/2 min-h-[45px]'
            allowLeadingZeros={true}
            size='xs'
            elementFieldId={item.fields[0].id}
            elementId={item.id}
            validate={
              !isReadOnly && item.config.required
                ? validatePhoneNumber
                : field.value === ''
                  ? null
                  : validatePhoneNumber
            }
            handleChange={handleOnChangeAnswer}
            component={PhoneNumberInput}
          />
          <Field
            validate={validateLabel}
            name={`${item.id}.subLabel`}
            placeholder='Type a sublabel'
            size='xs'
            text={item.config.sublabel}
            component={Text}
            classNameWrapper='min-h-[42px]'
            className={cn(
              'flex min-h-[20px] items-start gap-1 text-[13px] text-slate-500',
              {
                'text-slate-400': !item.config.sublabel,
              },
            )}
          />
        </div>
      )}
    />
  );
};
