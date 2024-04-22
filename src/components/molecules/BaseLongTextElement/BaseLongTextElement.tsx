import { useElementLayouts } from '@/contexts';
import { LongTextElement } from '@/types';

import { BaseElementProps } from '../FactoryElement';
import { LongText } from '../Textarea';

export const BaseLongTextElement = (
  props: BaseElementProps<LongTextElement>,
) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  return (
    <LongText
      handleOnChangeAnswer={handleOnChangeAnswer}
      item={item}
      isReadOnly={isReadOnly}
    />
  );
};
