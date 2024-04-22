import { Box, Group } from '@mantine/core';
import { Field } from 'formik';

import { useElementLayouts } from '@/contexts';
import { EmailElement } from '@/types';
import { cn, validateLabel } from '@/utils';
import { emailSchema, requiredEmailSchema } from '@/utils/schemas/validation';

import { BaseElementProps } from '../FactoryElement';
import { Text } from '../Text';
import { TextInput } from '../TextInput';

export const BaseEmailElement = (props: BaseElementProps<EmailElement>) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  const validateEmail = async (value: string) =>
    (item.config.required ? requiredEmailSchema : emailSchema)
      .validate(value)
      .then(() => {})
      .catch((err) => err.errors[0]);

  return (
    <Group>
      <Box className='w-full'>
        <Field
          name={`${item.id}.fieldLabel`}
          text={item.config.fieldLabel}
          placeholder='Type a question'
          required={item.config.required}
          validate={validateLabel}
          component={Text}
          classNameWrapper='min-h-[45px] mt-4'
          className={cn('flex min-h-[20px] items-start gap-1', {
            'text-slate-500': !item.config.fieldLabel,
          })}
        />
        <Field
          name={`${item.fields[0].id}.fieldValue`}
          readOnly={isReadOnly}
          value={item.fields[0].text}
          validate={!isReadOnly ? validateEmail : null}
          handleChange={handleOnChangeAnswer}
          elementFieldId={item.fields[0].id}
          elementId={item.id}
          component={TextInput}
          classNameWrapper='w-1/2 min-h-[60px]'
        />
        <Field
          name={`${item.id}.sublabel`}
          text={item.config.sublabel}
          placeholder='Type a sublabel'
          validate={validateLabel}
          component={Text}
          classNameWrapper='min-h-[42px]'
          className={cn(
            'flex min-h-[20px] items-start gap-1 text-[13px] text-slate-500',
            {
              'text-slate-400': !item.config.sublabel,
            },
          )}
        />
      </Box>
    </Group>
  );
};
