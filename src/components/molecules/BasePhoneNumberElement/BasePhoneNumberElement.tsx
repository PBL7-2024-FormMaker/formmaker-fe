import { useElementLayouts } from '@/contexts';
import { NumberPhoneElement } from '@/types';

import { BaseElementProps } from '../FactoryElement';
import { NumberPhone } from '../PhoneNumber';

export const BasePhoneNumberElement = (
  props: BaseElementProps<NumberPhoneElement>,
) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  return (
    <NumberPhone
      handleOnChangeAnswer={handleOnChangeAnswer}
      item={item}
      isReadOnly={isReadOnly}
    />
  );
};
