import { useElementLayouts } from '@/contexts';
import { TimeInputElement } from '@/types';

import { BaseElementProps } from '../FactoryElement';
import { TimeInput } from '../TimeInput';

export const BaseTimeInputElement = (
  props: BaseElementProps<TimeInputElement>,
) => {
  const { isReadOnly } = useElementLayouts();
  const { item, handleOnChangeAnswer } = props;

  return (
    <TimeInput
      item={item}
      isReadOnly={isReadOnly}
      handleOnChangeAnswer={handleOnChangeAnswer}
    />
  );
};
