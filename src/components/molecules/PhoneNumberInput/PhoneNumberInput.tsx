import { useEffect } from 'react';
import {
  NumberInput,
  NumberInputProps as NumberInputMantineProps,
} from '@mantine/core';
import {
  ErrorMessage,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { cn } from '@/utils/cn';

interface PhoneInputProps extends Omit<NumberInputMantineProps, 'form'> {
  handleChange?: (
    elementId: string,
    elementFieldId: string,
    value: string | number,
  ) => void;
  classNameError?: string;
  classNameWrapper?: string;
  elementFieldId?: string;
  elementId?: string;
  field: FieldInputProps<string>;
  form: {
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean,
    ) => Promise<void | FormikErrors<unknown>>;
  };
  meta: FieldMetaProps<string>;
  classNameLabel?: string;
}

export const PhoneNumberInput = (props: PhoneInputProps) => {
  const {
    elementFieldId,
    elementId,
    handleChange,
    field,
    classNameWrapper,
    form: { setFieldValue },
    classNameError,
    classNameLabel,
    ...rest
  } = props;

  useEffect(() => {
    setFieldValue(field.name, '');
  }, []);

  return (
    <div className={cn('flex flex-col', classNameWrapper)}>
      <NumberInput
        {...field}
        {...rest}
        type='tel'
        hideControls={true}
        onChange={(value) => {
          if (elementFieldId && elementId)
            handleChange?.(elementId, elementFieldId, value);
          setFieldValue(field.name, value);
        }}
        classNames={{
          label: cn('mb-2', classNameLabel),
        }}
      />
      {rest.readOnly || (
        <ErrorMessage
          name={field.name}
          render={(msg) => (
            <div className={cn('mt-1 text-xs text-red-600', classNameError)}>
              {msg}
            </div>
          )}
        />
      )}
    </div>
  );
};
