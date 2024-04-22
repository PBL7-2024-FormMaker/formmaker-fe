import {
  AddressElement,
  DatePickerElement,
  DropdownElement,
  ElementItem,
  ElementType,
  EmailElement,
  FullnameElement,
  HeadingElement,
  LongTextElement,
  MultipleChoiceElement,
  NumberPhoneElement,
  ScaleRatingElement,
  ShortTextElement,
  SingleChoiceElement,
  SubmitElement,
  TimeInputElement,
} from '@/types';

import { BaseAddressElement } from '../BaseAddressElement';
import { BaseDatePickerElement } from '../BaseDatePickerElement';
import { BaseDropdownElement } from '../BaseDropdownElement';
import { BaseEmailElement } from '../BaseEmailElement';
import { BaseFullnameElement } from '../BaseFullnameElement';
import { BaseHeadingElement } from '../BaseHeadingElement';
import { BaseLongTextElement } from '../BaseLongTextElement';
import { BaseMultipleChoiceElement } from '../BaseMultipleChoiceElement';
import { BasePhoneNumberElement } from '../BasePhoneNumberElement';
import { BaseScaleRatingElement } from '../BaseScaleRatingElement';
import { BaseShortTextElement } from '../BaseShortTextElement';
import { BaseSingleChoiceElement } from '../BaseSingleChoiceElement';
import { BaseSubmitElement } from '../BaseSubmitElement';
import { BaseTimeInputElement } from '../BaseTimeInput/BaseTimeInput';

export interface BaseElementProps<T extends ElementItem = ElementItem> {
  item: T;
  isActive: boolean;
  removeItem: (id: string) => void;
  updateItem: (item: T) => void;
  handleConfig: (config: T['config']) => void;
  handleOnChangeAnswer: (
    elementId: string,
    fieldId: string,
    value: string,
  ) => void;
}

export const FactoryElement = (props: BaseElementProps) => {
  const { item, ...rest } = props;
  switch (true) {
    case isHeadingElement(item):
      return <BaseHeadingElement item={item} {...rest} />;
    case isEmailElement(item):
      return <BaseEmailElement item={item} {...rest} />;
    case isFullnameElement(item):
      return <BaseFullnameElement item={item} {...rest} />;
    case isSubmitElement(item):
      return <BaseSubmitElement item={item} {...rest} />;
    case isShortTextElement(item):
      return <BaseShortTextElement item={item} {...rest} />;
    case isLongTextElement(item):
      return <BaseLongTextElement item={item} {...rest} />;
    case isScaleRatingElement(item):
      return <BaseScaleRatingElement item={item} {...rest} />;
    case isAddressElement(item):
      return <BaseAddressElement item={item} {...rest} />;
    case isDropdownElement(item):
      return <BaseDropdownElement item={item} {...rest} />;
    case isSingleChoiceElement(item):
      return <BaseSingleChoiceElement item={item} {...rest} />;
    case isMultipleChoiceElement(item):
      return <BaseMultipleChoiceElement item={item} {...rest} />;
    case isNumberPhoneElement(item):
      return <BasePhoneNumberElement item={item} {...rest} />;
    case isDatePickerInputElement(item):
      return <BaseDatePickerElement item={item} {...rest} />;
    case isTimeInputElement(item):
      return <BaseTimeInputElement item={item} {...rest} />;
    default:
      return <></>;
  }
};

export function isHeadingElement(item: ElementItem): item is HeadingElement {
  return item?.type === ElementType.HEADING;
}

export function isEmailElement(item: ElementItem): item is EmailElement {
  return item?.type === ElementType.EMAIL;
}

export function isFullnameElement(item: ElementItem): item is FullnameElement {
  return item?.type === ElementType.FULLNAME;
}

export function isShortTextElement(
  item: ElementItem,
): item is ShortTextElement {
  return item?.type === ElementType.SHORT_TEXT;
}

export function isLongTextElement(item: ElementItem): item is LongTextElement {
  return item?.type === ElementType.LONG_TEXT;
}

export function isSubmitElement(item: ElementItem): item is SubmitElement {
  return item?.type === ElementType.SUBMIT;
}

export function isScaleRatingElement(
  item: ElementItem,
): item is ScaleRatingElement {
  return item?.type === ElementType.SCALE_RATING;
}

export function isAddressElement(item: ElementItem): item is AddressElement {
  return item?.type === ElementType.ADDRESS;
}

export function isDropdownElement(item: ElementItem): item is DropdownElement {
  return item?.type === ElementType.DROPDOWN;
}

export function isSingleChoiceElement(
  item: ElementItem,
): item is SingleChoiceElement {
  return item?.type === ElementType.SINGLE_CHOICE;
}

export function isMultipleChoiceElement(
  item: ElementItem,
): item is MultipleChoiceElement {
  return item?.type === ElementType.MULTIPLE_CHOICE;
}

export function isNumberPhoneElement(
  item: ElementItem,
): item is NumberPhoneElement {
  return item?.type === ElementType.PHONE;
}

export function isDatePickerInputElement(
  item: ElementItem,
): item is DatePickerElement {
  return item?.type === ElementType.DATEPICKER;
}

export function isTimeInputElement(
  item: ElementItem,
): item is TimeInputElement {
  return item?.type === ElementType.TIME;
}
