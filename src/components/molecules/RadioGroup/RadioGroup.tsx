import { useEffect } from 'react';
import {
  Radio as MantineRadio,
  RadioGroupProps as MantineRadioGroupProps,
  Stack,
} from '@mantine/core';
import {
  ErrorMessage,
  Field,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { SingleChoiceElement } from '@/types';
import { validateLabel } from '@/utils';
import { cn } from '@/utils/cn';

import { Radio } from '../Radio';

interface RadioGroupProps extends Omit<MantineRadioGroupProps, 'form'> {
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
  classNameLabel?: string;
  item: SingleChoiceElement;
}

export const RadioGroup = (props: RadioGroupProps) => {
  const {
    handleChange,
    field,
    elementFieldId,
    elementId,
    classNameWrapper,
    form: { setFieldValue },
    classNameError,
    classNameLabel,
    item,
    ...rest
  } = props;

  useEffect(() => {
    setFieldValue(field.name, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('flex w-full flex-col', classNameWrapper)}>
      <MantineRadio.Group
        {...field}
        {...rest}
        value={field.value}
        onChange={(value: string) => {
          if (elementFieldId && elementId) {
            handleChange?.(elementId, elementFieldId, value);
            setFieldValue(field.name, value);
          }
          field.onChange(value);
        }}
        classNames={{
          label: cn('mb-2', classNameLabel),
        }}
      >
        <Stack mt='xs'>
          {item.config.options.map((option, index) => (
            <Field
              name={`${item.id}.option${index}`}
              validate={validateLabel}
              value={option}
              component={Radio}
              key={index}
              optionValue={option}
            />
          ))}
          {item.config.otherOption.isDisplayed && (
            <Field
              name={`${item.id}.otherOption.text`}
              validate={validateLabel}
              value={item.config.otherOption.text}
              component={Radio}
              optionValue={item.config.otherOption.text}
            />
          )}
        </Stack>
      </MantineRadio.Group>
      <ErrorMessage
        name={field.name}
        render={(msg) => (
          <div className={cn('mt-3 text-xs text-red-600', classNameError)}>
            {msg}
          </div>
        )}
      />
    </div>
  );
};
