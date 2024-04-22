import { useElementLayouts } from '@/contexts';
import { DatePickerElement } from '@/types';

import { DatePickerInput } from '../DatePickerInput';
import { BaseElementProps } from '../FactoryElement';

export const BaseDatePickerElement = (
  props: BaseElementProps<DatePickerElement>,
) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  return (
    <DatePickerInput
      handleOnChangeAnswer={handleOnChangeAnswer}
      item={item}
      isReadOnly={isReadOnly}
    />
  );
};
