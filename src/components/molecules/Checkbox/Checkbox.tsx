import { useEffect } from 'react';
import {
  Checkbox as MantineCheckbox,
  CheckboxProps as MantineCheckboxProps,
} from '@mantine/core';
import {
  ErrorMessage,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { useElementLayouts } from '@/contexts';
import { cn } from '@/utils';

interface CheckboxProps extends Omit<MantineCheckboxProps, 'form'> {
  classNameError?: string;
  classNameWrapper?: string;
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
  optionValue: string | readonly string[] | number | undefined;
}

export const Checkbox = (props: CheckboxProps) => {
  const {
    field,
    classNameWrapper,
    form: { setFieldValue },
    classNameError,
    optionValue,
    ...rest
  } = props;

  const { isReadOnly } = useElementLayouts();

  useEffect(() => {
    if (optionValue) {
      setFieldValue(field.name, optionValue);
      return;
    }
    setFieldValue(field.name, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionValue]);

  return (
    <div className={cn('flex w-full flex-col', classNameWrapper)}>
      <MantineCheckbox
        {...field}
        {...rest}
        value={optionValue}
        label={optionValue || 'Type an option'}
        classNames={{
          label: cn('mb-2', optionValue ? 'text-black' : 'text-slate-500'),
        }}
        disabled={isReadOnly}
      />
      <ErrorMessage
        name={field.name}
        render={(msg) => (
          <div className={cn('text-xs text-red-600', classNameError)}>
            {msg}
          </div>
        )}
      />
    </div>
  );
};
