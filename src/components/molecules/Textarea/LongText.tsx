import { Field, FieldArray } from 'formik';

import { LongTextElement } from '@/types';
import { cn, validateFieldValue, validateLabel } from '@/utils';

import { Text } from '../Text';

import { Textarea } from '.';

interface LongTextProps {
  isReadOnly?: boolean;
  item: LongTextElement;
  handleOnChangeAnswer: (
    elementId: string,
    elementFieldId: string,
    value: string,
  ) => void;
}

export const LongText = (props: LongTextProps) => {
  const { isReadOnly = false, item, handleOnChangeAnswer } = props;

  return (
    <FieldArray
      name='longText'
      render={() => (
        <div className='flex flex-col gap-2'>
          <Field
            required={item.config.required}
            validate={validateLabel}
            text={item.config.fieldLabel}
            placeholder='Type a question'
            name={`${item.id}.fieldLabel`}
            component={Text}
            classNameWrapper='min-h-[45px] mt-4'
            className={cn('flex min-h-[20px] items-start gap-1', {
              'text-slate-500': !item.config.fieldLabel,
            })}
          />
          <Field
            readOnly={isReadOnly}
            name={`${item.id}.fieldValue`}
            classNameWrapper='w-full min-h-[124px]'
            validate={
              !isReadOnly && item.config.required ? validateFieldValue : null
            }
            size='sm'
            elementFieldId={item.fields[0].id}
            elementId={item.id}
            handleChange={handleOnChangeAnswer}
            component={Textarea}
            resize={isReadOnly ? 'none' : 'vertical'}
            classNames={{
              input: 'max-h-[180px] min-h-[100px] overflow-y-auto',
            }}
          />
          <Field
            validate={validateLabel}
            name={`${item.id}.subLabel`}
            size='xs'
            placeholder={item.config.placeholder}
            text={item.config.sublabel}
            component={Text}
            classNameWrapper='min-h-[42px]'
            className={cn(
              'flex min-h-[20px] items-start gap-1 text-[13px] text-slate-500',
              {
                'text-slate-400': !item.config.sublabel,
              },
            )}
          />
        </div>
      )}
    />
  );
};
