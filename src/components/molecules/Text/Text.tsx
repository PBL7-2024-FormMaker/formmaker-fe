import { useEffect } from 'react';
import {
  Text as TextMantine,
  TextProps as TextMantineProps,
} from '@mantine/core';
import {
  ErrorMessage,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { cn } from '@/utils/cn';

interface TextProps extends Omit<TextMantineProps, 'form'> {
  classNameError?: string;
  classNameWrapper?: string;
  required?: boolean;
  field: FieldInputProps<string>;
  form: {
    touched: Record<string, boolean>;
    errors: Record<string, string>;
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean,
    ) => Promise<void | FormikErrors<unknown>>;
  };
  meta: FieldMetaProps<string>;
  text: string;
  placeholder?: string;
}

export const Text = (props: TextProps) => {
  const {
    field,
    classNameWrapper,
    form: { setFieldValue },
    classNameError,
    required = false,
    ...rest
  } = props;

  useEffect(() => {
    if (rest.text) {
      setFieldValue(field.name, rest.text);
      return;
    }
    setFieldValue(field.name, '');
  }, [field.name, rest.text]);

  return (
    <div className={cn('flex w-full flex-col', classNameWrapper)}>
      <TextMantine
        className={cn('mb-2 text-base font-[500]', rest.className)}
        {...rest}
      >
        {rest.text ? rest.text : rest.placeholder}
        {required && <span className='text-lg text-red-500'>*</span>}
      </TextMantine>
      <ErrorMessage
        name={field.name}
        render={(msg) => (
          <div className={cn('mt-1 text-xs text-red-600', classNameError)}>
            {msg}
          </div>
        )}
      />
    </div>
  );
};
