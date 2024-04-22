import { DEFAULT_BUTTON_COLOR } from '@/constants/buttonStyles';
import {
  AddressConfig,
  DatePickerConfig,
  DropdownConfig,
  EmailConfig,
  FullnameConfig,
  HeadingConfig,
  MultipleChoiceConfig,
  NumberPhoneConfig,
  ScaleRatingConfig,
  SingleChoiceConfig,
  SubmitConfig,
  TextConfig,
  TimeInputConfig,
} from '@/types';

export const defaultHeadingConfig: HeadingConfig = {
  headingText: 'Heading',
  subheadingText: 'Subheader',
};

export const defaultEmailConfig: EmailConfig = {
  fieldLabel: 'Email',
  required: false,
  sublabel: 'example@example.com',
};

export const defaultFullnameConfig: FullnameConfig = {
  fieldLabel: 'Name',
  required: false,
  sublabels: {
    firstName: 'First Name',
    lastName: 'Last Name',
  },
};

export const defaultSubmitConfig: SubmitConfig = {
  buttonText: 'Submit',
  buttonColor: DEFAULT_BUTTON_COLOR,
  buttonAlignment: 'center',
};

export const defaultTextConfig: TextConfig = {
  fieldLabel: 'Type a question',
  required: false,
  placeholder: 'Type a sublabel',
  sublabel: 'Please enter your answer',
};

export const defaultScaleRatingConfig: ScaleRatingConfig = {
  fieldLabel: 'Type a question',
  required: false,
  lowestRatingText: 'Worst',
  highestRatingText: 'Best',
};

export const defaultAddressConfig: AddressConfig = {
  fieldLabel: 'Type your address',
  required: false,
  sublabels: {
    street: 'Type your street',
    ward: 'Type your ward',
    district: 'Type your district',
    city: 'Type your city',
  },
};

export const defaultDropdownConfig: DropdownConfig = {
  fieldLabel: 'Type a question',
  required: false,
  sublabel: 'Type a sublabel',
  options: ['option 1', 'option 2', 'option 3'],
};

export const defaultSingleChoiceConfig: SingleChoiceConfig = {
  fieldLabel: 'Type a question',
  required: false,
  options: ['Type option 1', 'Type option 2', 'Type option 3', 'Type option 4'],
  otherOption: {
    isDisplayed: false,
    text: 'Other',
  },
};

export const defaultDatePickerConfig: DatePickerConfig = {
  fieldLabel: 'Date',
  required: false,
  sublabel: 'Date',
};

export const defaultMultipleChoiceConfig: MultipleChoiceConfig = {
  fieldLabel: 'Type a question',
  required: false,
  options: ['Type option 1', 'Type option 2', 'Type option 3', 'Type option 4'],
  otherOption: { isDisplayed: false, text: 'Other' },
};

export const defaultNumberPhoneConfig: NumberPhoneConfig = {
  fieldLabel: 'Type your phone number',
  required: false,
  sublabel: 'Please enter your phone number',
};

export const defaultTimeInputConfig: TimeInputConfig = {
  fieldLabel: 'Time',
  required: false,
  sublabels: {
    hour: 'hour',
    minutes: 'minutes',
  },
};

export const defaultShortTextHeightWidth = {
  h: 5,
  w: 12,
};
export const defaultTimeHeightWidth = {
  h: 4,
  w: 12,
};

export const defaultScaleRatingHeightWidth = {
  h: 4,
  w: 12,
};

export const defaultLongTextHeightWidth = {
  h: 7,
  w: 12,
};

export const defaultHeadingHeightWidth = {
  h: 4,
  w: 12,
};

export const defaultSubmitHeightWidth = {
  h: 4,
  w: 12,
};

export const defaultAddressHeightWidth = {
  h: 10,
  w: 12,
};

export const defaultDropdownHeightWidth = {
  h: 5,
  w: 12,
};

export const defaultSingleChoiceHeightWidth = {
  h: 7,
  w: 12,
};

export const defaultMultipleChoiceHeightWidth = {
  h: 7,
  w: 12,
};
