import { useElementLayouts } from '@/contexts';
import { ShortTextElement } from '@/types';

import { BaseElementProps } from '../FactoryElement';
import { ShortText } from '../TextInput/ShortText';

export const BaseShortTextElement = (
  props: BaseElementProps<ShortTextElement>,
) => {
  const { isReadOnly } = useElementLayouts();
  const { item, handleOnChangeAnswer } = props;

  return (
    <ShortText
      item={item}
      isReadOnly={isReadOnly}
      handleOnChangeAnswer={handleOnChangeAnswer}
    />
  );
};
