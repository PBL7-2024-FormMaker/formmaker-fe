import {
  defaultAddressHeightWidth,
  defaultDropdownHeightWidth,
  defaultHeadingHeightWidth,
  defaultLongTextHeightWidth,
  defaultMultipleChoiceHeightWidth,
  defaultScaleRatingHeightWidth,
  defaultShortTextHeightWidth,
  defaultSingleChoiceHeightWidth,
  defaultSubmitHeightWidth,
  defaultTimeHeightWidth,
} from '@/configs/defaultElementConfigs';
import { ElementType } from '@/types';

export const getDefaultWidthHeight = (type: ElementType | undefined) => {
  switch (true) {
    case type === ElementType.SHORT_TEXT:
      return defaultShortTextHeightWidth;
    case type === ElementType.LONG_TEXT:
      return defaultLongTextHeightWidth;
    case type === ElementType.ADDRESS:
      return defaultAddressHeightWidth;
    case type === ElementType.DROPDOWN:
      return defaultDropdownHeightWidth;
    case type === ElementType.SINGLE_CHOICE:
      return defaultSingleChoiceHeightWidth;
    case type === ElementType.MULTIPLE_CHOICE:
      return defaultMultipleChoiceHeightWidth;
    case type === ElementType.TIME:
      return defaultTimeHeightWidth;
    case type === ElementType.SCALE_RATING:
      return defaultScaleRatingHeightWidth;
    case type === ElementType.HEADING:
      return defaultHeadingHeightWidth;
    case type === ElementType.SUBMIT:
      return defaultSubmitHeightWidth;
    default:
      return {
        h: 5,
        w: 12,
      };
  }
};
