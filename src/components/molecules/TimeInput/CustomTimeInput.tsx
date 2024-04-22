import { useEffect, useRef } from 'react';
import { IoTime } from 'react-icons/io5';
import { ActionIcon } from '@mantine/core';
import {
  TimeInput as TimeInputMantine,
  TimeInputProps as TimeInputMantineProps,
} from '@mantine/dates';
import {
  ErrorMessage,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { cn } from '@/utils/cn';

interface TimeInputProps extends Omit<TimeInputMantineProps, 'form'> {
  handleChange?: (elementId: string, fieldId: string, value: string) => void;
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
    ) =>
      | Promise<void>
      | Promise<
          FormikErrors<{
            firstName: string;
            lastName: string;
            email: string;
          }>
        >;
    setFieldError: (field: string, value: string | undefined) => void;
  };
  meta: FieldMetaProps<string>;
  classNameLabel?: string;
}

export const TimeInput = (props: TimeInputProps) => {
  const {
    handleChange,
    field,
    elementFieldId,
    elementId,
    classNameWrapper,
    form: { setFieldValue, setFieldTouched, setFieldError },
    classNameError,
    classNameLabel,
    ...rest
  } = props;

  useEffect(() => {
    setFieldValue(field.name, '');
  }, []);

  const ref = useRef<HTMLInputElement>(null);
  const pickerControl = (
    <ActionIcon
      variant='subtle'
      color='gray'
      onClick={() => ref.current?.showPicker()}
    >
      <IoTime />
    </ActionIcon>
  );
  return (
    <div className={cn('flex w-full flex-col', classNameWrapper)}>
      <TimeInputMantine
        {...rest}
        ref={ref}
        onChange={(e) => {
          if (elementFieldId && elementId)
            handleChange?.(elementId, elementFieldId, e.currentTarget.value);
          setFieldValue(field.name, e.target.value);
          setFieldError(field.name, undefined);
        }}
        onBlur={() => {
          setFieldTouched(field.name, true);
        }}
        classNames={{
          label: cn('mb-2', classNameLabel),
        }}
        rightSection={rest.readOnly ? undefined : pickerControl}
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
