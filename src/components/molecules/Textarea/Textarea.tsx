import { useEffect } from 'react';
import {
  Textarea as TextareaMantine,
  TextareaProps as TextareaMantineProps,
} from '@mantine/core';
import {
  ErrorMessage,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { cn } from '@/utils/cn';

interface TextareaProps extends Omit<TextareaMantineProps, 'form'> {
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
  };
  meta: FieldMetaProps<string>;
  valueConfig: string;
}

export const Textarea = (props: TextareaProps) => {
  const {
    elementFieldId,
    elementId,
    handleChange,
    field,
    classNameError,
    form: { setFieldValue },
    classNameWrapper,
    resize = 'vertical',
    ...rest
  } = props;
  useEffect(() => {
    setFieldValue(field.name, '');
  }, []);

  return (
    <div className={cn('flex flex-col', classNameWrapper)}>
      <TextareaMantine
        {...field}
        resize={resize}
        {...rest}
        onChange={(e) => {
          if (elementFieldId && elementId)
            handleChange?.(elementId, elementFieldId, e.currentTarget.value);
          field.onChange(e);
        }}
        classNames={rest.classNames}
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
