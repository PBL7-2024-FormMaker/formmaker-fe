import { useEffect, useState } from 'react';
import {
  DatePickerInput as DatePickerInputMantine,
  DatePickerInputProps as DatePickerInputMantineProps,
} from '@mantine/dates';
import dayjs from 'dayjs';
import {
  ErrorMessage,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { cn } from '@/utils/cn';

interface DatePickerInputProps
  extends Omit<DatePickerInputMantineProps, 'form'> {
  handleChange?: (
    elementId: string,
    elementFieldId: string,
    value: string,
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
    setFieldTouched: (
      field: string,
      touched?: boolean | undefined,
      shouldValidate?: boolean | undefined,
    ) => Promise<void> | Promise<FormikErrors<unknown>>;

    setFieldError: (field: string, value: string | undefined) => void;
  };
  meta: FieldMetaProps<string>;
  classNameLabel?: string;
  valueConfig: string;
}

export const DatePickerInput = (props: DatePickerInputProps) => {
  const {
    elementFieldId,
    elementId,
    handleChange,
    field,
    classNameWrapper,
    form: { setFieldValue, setFieldError, setFieldTouched },
    classNameError,
    classNameLabel,
    ...rest
  } = props;
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setFieldValue(field.name, '');
  }, []);

  return (
    <div className={cn('flex w-full flex-col', classNameWrapper)}>
      <DatePickerInputMantine
        name={field.name}
        {...rest}
        onFocus={() => {
          setTouched(!touched);
          if (touched) setFieldTouched(field.name, true);
        }}
        onChange={(value) => {
          if (elementFieldId && elementId)
            handleChange?.(
              elementId,
              elementFieldId,
              dayjs(value?.toString() || '').format('MMM DD, YYYY'),
            );
          setFieldValue(field.name, value?.toString());
          setFieldError(field.name, undefined);
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
