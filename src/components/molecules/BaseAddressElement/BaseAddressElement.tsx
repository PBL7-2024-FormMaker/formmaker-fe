import { useElementLayouts } from '@/contexts';
import { AddressElement } from '@/types';

import { Address } from '../Address';
import { BaseElementProps } from '../FactoryElement';

export const BaseAddressElement = (props: BaseElementProps<AddressElement>) => {
  const { item, handleOnChangeAnswer } = props;
  const { isReadOnly } = useElementLayouts();

  return (
    <Address
      handleOnChangeAnswer={handleOnChangeAnswer}
      item={item}
      isReadOnly={isReadOnly}
    />
  );
};
