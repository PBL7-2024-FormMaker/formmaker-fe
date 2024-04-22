import { useEffect } from 'react';
import {
  Checkbox as MantineCheckbox,
  CheckboxGroupProps as MantineCheckboxGroupProps,
  Stack,
} from '@mantine/core';
import {
  ErrorMessage,
  Field,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { MultipleChoiceElement } from '@/types';
import { cn, validateLabel } from '@/utils';

import { Checkbox } from '../Checkbox';

interface CheckboxGroupProps extends Omit<MantineCheckboxGroupProps, 'form'> {
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
  meta: FieldMetaProps<string[]>;
  classNameLabel?: string;
  item: MultipleChoiceElement;
}

export const CheckboxGroup = (props: CheckboxGroupProps) => {
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
    setFieldValue(field.name, '');
  }, []);

  return (
    <div className={cn('flex w-full flex-col', classNameWrapper)}>
      <MantineCheckbox.Group
        {...rest}
        onBlur={field.onBlur}
        onChange={(value: string[]) => {
          if (elementFieldId && elementId) {
            handleChange?.(elementId, elementFieldId, value.join(', '));
            setFieldValue(field.name, value.join(', '));
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
              component={Checkbox}
              key={index}
              optionValue={option}
            />
          ))}
          {item.config.otherOption.isDisplayed && (
            <Field
              name={`${item.id}.otherOption.text`}
              validate={validateLabel}
              value={item.config.otherOption.text}
              component={Checkbox}
              optionValue={item.config.otherOption.text}
            />
          )}
        </Stack>
      </MantineCheckbox.Group>
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
