import { useEffect } from 'react';
import {
  Combobox as MantineCombobox,
  ComboboxOptionProps as MantineOptionProps,
  ComboboxProps as ComboboxMantineProps,
  Input,
  InputBase,
  ScrollArea,
  useCombobox,
} from '@mantine/core';
import {
  ErrorMessage,
  Field,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
} from 'formik';

import { MESSAGES } from '@/constants';
import { DropdownElement } from '@/types';
import { cn, validateLabel } from '@/utils';

interface ComboboxProps extends Omit<ComboboxMantineProps, 'form'> {
  item: DropdownElement;
  handleChange: (elementId: string, fieldId: string, value: string) => void;
  classNameError?: string;
  classNameWrapper?: string;
  elementFieldId: string;
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
  valueConfig: string;
}

interface OptionProps extends Omit<MantineOptionProps, 'form'> {
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
  optionValue: string;
  readOnly: boolean;
}

const Option = ({
  field,
  classNameWrapper,
  form: { setFieldValue },
  classNameError,
  optionValue,
  readOnly,
  ...rest
}: OptionProps) => {
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
      <MantineCombobox.Option
        {...rest}
        {...field}
        value={optionValue}
        className={cn(
          'hover:bg-malachite-100',
          optionValue ? 'text-black' : 'text-slate-500',
        )}
        disabled={readOnly}
      >
        {optionValue || 'Type an option'}
      </MantineCombobox.Option>
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

export const Combobox = ({
  item,
  handleChange,
  field,
  elementFieldId,
  classNameWrapper,
  form: { setFieldValue },
  classNameError,
  ...rest
}: ComboboxProps) => {
  useEffect(() => {
    setFieldValue(field.name, '');
  }, []);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = item.config.options.map((option, index) => (
    <Field
      readOnly={rest.readOnly}
      name={`${item.id}.option${index}`}
      validate={validateLabel}
      value={option}
      component={Option}
      key={index}
      optionValue={option}
    />
  ));

  const hasEmptyOption = item.config.options.some((option) => option === '');

  return (
    <div className={cn('flex flex-col', classNameWrapper)}>
      <MantineCombobox
        {...field}
        {...rest}
        store={combobox}
        offset={0}
        onOptionSubmit={(value) => {
          handleChange(item.id, elementFieldId, value);
          setFieldValue(field.name, value);
          combobox.closeDropdown();
        }}
      >
        <MantineCombobox.Target>
          <InputBase
            component='button'
            type='button'
            rightSection={<MantineCombobox.Chevron />}
            rightSectionPointerEvents='none'
            onClick={() => combobox.toggleDropdown()}
          >
            {item.fields[0].text || (
              <Input.Placeholder>Please select</Input.Placeholder>
            )}
          </InputBase>
        </MantineCombobox.Target>

        <MantineCombobox.Dropdown>
          <MantineCombobox.Options>
            <ScrollArea.Autosize type='scroll' mah={100}>
              {options}
            </ScrollArea.Autosize>
          </MantineCombobox.Options>
        </MantineCombobox.Dropdown>
      </MantineCombobox>
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
      {hasEmptyOption && (
        <div className={cn('mt-1 text-xs text-red-600', classNameError)}>
          {MESSAGES.REQUIRED_OPTIONS}
        </div>
      )}
    </div>
  );
};
