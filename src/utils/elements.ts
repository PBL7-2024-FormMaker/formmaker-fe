import { v4 as uuidv4 } from 'uuid';

import {
  defaultAddressConfig,
  defaultDatePickerConfig,
  defaultDropdownConfig,
  defaultEmailConfig,
  defaultFullnameConfig,
  defaultHeadingConfig,
  defaultMultipleChoiceConfig,
  defaultNumberPhoneConfig,
  defaultScaleRatingConfig,
  defaultSingleChoiceConfig,
  defaultSubmitConfig,
  defaultTextConfig,
  defaultTimeInputConfig,
} from '@/configs';
import {
  defaultAddressHeightWidth,
  defaultDropdownHeightWidth,
  defaultFileConfig,
  defaultHeadingHeightWidth,
  defaultImageConfig,
  defaultLongTextHeightWidth,
  defaultMultipleChoiceHeightWidth,
  defaultScaleRatingHeightWidth,
  defaultShortTextHeightWidth,
  defaultSingleChoiceHeightWidth,
  defaultSubmitHeightWidth,
  defaultTimeHeightWidth,
} from '@/configs/defaultElementConfigs';
import { ElementItem, ElementType, GridSize } from '@/types';

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

export const createItem = (
  type: string,
  currentItem: GridSize,
): ElementItem | undefined => {
  const uid = uuidv4();
  const getGridSize = (currentItem: GridSize) => ({
    x: currentItem.x,
    y: currentItem.y,
    w: currentItem.w,
    h: currentItem.h,
  });
  switch (type) {
    case ElementType.HEADING:
      return {
        id: uid,
        type: ElementType.HEADING,
        gridSize: getGridSize(currentItem),
        config: defaultHeadingConfig,
        fields: [],
      };
    case ElementType.EMAIL:
      return {
        id: uid,
        type: ElementType.EMAIL,
        gridSize: getGridSize(currentItem),
        config: defaultEmailConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'email',
            text: '',
          },
        ],
      };
    case ElementType.FULLNAME:
      return {
        id: uid,
        type: ElementType.FULLNAME,
        gridSize: getGridSize(currentItem),
        config: defaultFullnameConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'firstName',
            text: '',
          },
          {
            id: uuidv4(),
            name: 'lastName',
            text: '',
          },
        ],
      };
    case ElementType.SUBMIT:
      return {
        id: uid,
        type: ElementType.SUBMIT,
        gridSize: getGridSize(currentItem),
        config: defaultSubmitConfig,
        fields: [],
      };
    case ElementType.SHORT_TEXT:
      return {
        id: uid,
        type: ElementType.SHORT_TEXT,
        gridSize: getGridSize(currentItem),
        config: defaultTextConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'shortText',
          },
        ],
      };
    case ElementType.LONG_TEXT:
      return {
        id: uid,
        type: ElementType.LONG_TEXT,
        gridSize: getGridSize(currentItem),
        config: defaultTextConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'longText',
          },
        ],
      };
    case ElementType.SCALE_RATING:
      return {
        id: uid,
        type: ElementType.SCALE_RATING,
        gridSize: getGridSize(currentItem),
        config: defaultScaleRatingConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'scaleRating',
            text: '',
          },
        ],
      };
    case ElementType.ADDRESS:
      return {
        id: uid,
        type: ElementType.ADDRESS,
        gridSize: getGridSize(currentItem),
        config: defaultAddressConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'street',
          },
          {
            id: uuidv4(),
            name: 'ward',
          },
          {
            id: uuidv4(),
            name: 'district',
          },
          {
            id: uuidv4(),
            name: 'city',
          },
        ],
      };
    case ElementType.DROPDOWN:
      return {
        id: uid,
        type: ElementType.DROPDOWN,
        gridSize: getGridSize(currentItem),
        config: defaultDropdownConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'dropdown',
          },
        ],
      };
    case ElementType.SINGLE_CHOICE:
      return {
        id: uid,
        type: ElementType.SINGLE_CHOICE,
        gridSize: getGridSize(currentItem),
        config: defaultSingleChoiceConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'singleChoice',
          },
        ],
      };
    case ElementType.MULTIPLE_CHOICE:
      return {
        id: uid,
        type: ElementType.MULTIPLE_CHOICE,
        gridSize: getGridSize(currentItem),
        config: defaultMultipleChoiceConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'multipleChoice',
          },
        ],
      };
    case ElementType.PHONE:
      return {
        id: uid,
        type: ElementType.PHONE,
        gridSize: getGridSize(currentItem),
        config: defaultNumberPhoneConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'phoneNumber',
          },
        ],
      };
    case ElementType.DATEPICKER:
      return {
        id: uid,
        type: ElementType.DATEPICKER,
        gridSize: getGridSize(currentItem),
        config: defaultDatePickerConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'datePicker',
          },
        ],
      };
    case ElementType.TIME:
      return {
        id: uid,
        type: ElementType.TIME,
        gridSize: getGridSize(currentItem),
        config: defaultTimeInputConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'timeInput',
          },
        ],
      };
    case ElementType.IMAGE:
      return {
        id: uid,
        type: ElementType.IMAGE,
        gridSize: getGridSize(currentItem),
        config: defaultImageConfig,
        fields: [],
      };
    case ElementType.FILE_UPLOAD:
      return {
        id: uid,
        type: ElementType.FILE_UPLOAD,
        gridSize: getGridSize(currentItem),
        config: defaultFileConfig,
        fields: [
          {
            id: uuidv4(),
            name: 'fileUpload',
          },
        ],
      };

    default:
      return undefined;
  }
};
