import {
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
} from 'react-icons/ri';
import { Box } from '@mantine/core';
import { Field } from 'formik';

import { useElementLayouts } from '@/contexts';
import { ScaleRatingElement } from '@/types';
import { cn, validateFieldValue, validateLabel } from '@/utils';

import { BaseElementProps } from '../FactoryElement';
import { Rating } from '../Rating';
import { Text } from '../Text';

export const BaseScaleRatingElement = (
  props: BaseElementProps<ScaleRatingElement>,
) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  const commonStyle = 'size-9 rounded-full border border-solid p-3';

  const emptyStyle = 'border-slate-500 text-slate-500';

  const fullStyle = 'border-malachite-500 text-white bg-malachite-500';

  const getEmptyIcon = (value: number) => {
    const iconEmptyStyle = cn(commonStyle, emptyStyle);
    switch (value) {
      case 1:
        return <RiNumber1 className={iconEmptyStyle} />;
      case 2:
        return <RiNumber2 className={iconEmptyStyle} />;
      case 3:
        return <RiNumber3 className={iconEmptyStyle} />;
      case 4:
        return <RiNumber4 className={iconEmptyStyle} />;
      case 5:
        return <RiNumber5 className={iconEmptyStyle} />;
      default:
        return null;
    }
  };

  const getFullIcon = (value: number) => {
    const iconFullStyle = cn(commonStyle, fullStyle);
    switch (value) {
      case 1:
        return <RiNumber1 className={iconFullStyle} />;
      case 2:
        return <RiNumber2 className={iconFullStyle} />;
      case 3:
        return <RiNumber3 className={iconFullStyle} />;
      case 4:
        return <RiNumber4 className={iconFullStyle} />;
      case 5:
        return <RiNumber5 className={iconFullStyle} />;
      default:
        return null;
    }
  };

  return (
    <Box className='w-full'>
      <Field
        name={`${item.id}.fieldLabel`}
        text={item.config.fieldLabel}
        placeholder='Type a question'
        required={item.config.required}
        validate={validateLabel}
        component={Text}
        classNameWrapper='min-h-[40px]'
        className={cn('flex min-h-[20px] items-start gap-1', {
          'text-slate-500': !item.config.fieldLabel,
        })}
      />
      <Field
        name={`${item.fields[0].id}.fieldValue`}
        classNameWrapper='w-full'
        validate={
          !isReadOnly && item.config.required ? validateFieldValue : null
        }
        elementFieldId={item.fields[0].id}
        elementId={item.id}
        emptySymbol={getEmptyIcon}
        fullSymbol={getFullIcon}
        highlightSelectedOnly
        readOnly={isReadOnly}
        handleChange={handleOnChangeAnswer}
        itemConfig={item.config}
        component={Rating}
        placeholderWorstText='Type worst text'
        placeholderBestText='Type best text'
      />
    </Box>
  );
};
