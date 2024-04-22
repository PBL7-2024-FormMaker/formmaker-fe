import { Layout as LayoutProps } from 'react-grid-layout';

export interface HeadingConfig {
  headingText: string;
  subheadingText: string;
}

export interface EmailConfig {
  fieldLabel: string;
  required: boolean;
  sublabel: string;
}

export interface FullnameConfig {
  fieldLabel: string;
  required: boolean;
  sublabels: {
    firstName: string;
    lastName: string;
  };
}

export interface TextConfig {
  fieldLabel: string;
  required: boolean;
  placeholder: string;
  sublabel: string;
}

export interface SubmitConfig {
  buttonText: string;
  buttonColor: string;
  buttonAlignment: string;
}

export interface ScaleRatingConfig {
  fieldLabel: string;
  required: boolean;
  lowestRatingText: string;
  highestRatingText: string;
}

export interface AddressConfig {
  fieldLabel: string;
  required: boolean;
  sublabels: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
}

export interface DropdownConfig {
  fieldLabel: string;
  required: boolean;
  sublabel: string;
  options: string[];
}

export interface SingleChoiceConfig {
  fieldLabel: string;
  required: boolean;
  options: string[];
  otherOption: {
    isDisplayed: boolean;
    text: string;
  };
}

export interface TimeInputConfig {
  fieldLabel: string;
  required: boolean;
  sublabels: {
    hour: string;
    minutes: string;
  };
}

export interface MultipleChoiceConfig {
  fieldLabel: string;
  required: boolean;
  options: string[];
  otherOption: {
    isDisplayed: boolean;
    text: string;
  };
}

export interface NumberPhoneConfig {
  fieldLabel: string;
  sublabel: string;
  required: boolean;
}

export interface DatePickerConfig {
  fieldLabel: string;
  required: boolean;
  sublabel: string;
}

export type ElementConfig =
  | HeadingConfig
  | FullnameConfig
  | EmailConfig
  | TextConfig
  | SubmitConfig
  | ScaleRatingConfig
  | AddressConfig
  | DropdownConfig
  | SingleChoiceConfig
  | MultipleChoiceConfig
  | AddressConfig
  | NumberPhoneConfig
  | DatePickerConfig
  | TimeInputConfig;

export enum ElementType {
  HEADING = 'Heading',
  EMAIL = 'Email',
  FULLNAME = 'Fullname',
  ADDRESS = 'Address',
  PHONE = 'Phone',
  DATEPICKER = 'Datepicker',
  APPOINTMENT = 'Appointment',
  SHORT_TEXT = 'Short Text',
  LONG_TEXT = 'Long Text',
  DROPDOWN = 'Dropdown',
  SINGLE_CHOICE = 'Single Choice',
  MULTIPLE_CHOICE = 'Multiple Choice',
  NUMBER = 'Number',
  IMAGE = 'Image',
  FILE_UPLOAD = 'File Upload',
  TIME = 'Time',
  SUBMIT = 'Submit',
  INPUT_TABLE = 'Input Table',
  STAR_RATING = 'Star Rating',
  SCALE_RATING = 'Scale Rating',
  DIVIDER = 'Divider',
  PAGE_BREAK = 'Page Break',
}

export type GridSize = Pick<LayoutProps, 'x' | 'y' | 'w' | 'h'>;

export interface BaseElement<T extends ElementType, U extends ElementConfig> {
  id: string;
  type: T;
  gridSize: GridSize;
  config: U;
  fields: {
    id: string;
    name: string;
    text?: string;
  }[];
}

export type HeadingElement = BaseElement<ElementType.HEADING, HeadingConfig>;

export type EmailElement = BaseElement<ElementType.EMAIL, EmailConfig>;

export type FullnameElement = BaseElement<ElementType.FULLNAME, FullnameConfig>;

export type ShortTextElement = BaseElement<ElementType.SHORT_TEXT, TextConfig>;

export type LongTextElement = BaseElement<ElementType.LONG_TEXT, TextConfig>;

export type SubmitElement = BaseElement<ElementType.SUBMIT, SubmitConfig>;

export type ScaleRatingElement = BaseElement<
  ElementType.SCALE_RATING,
  ScaleRatingConfig
>;

export type AddressElement = BaseElement<ElementType.ADDRESS, AddressConfig>;
export type NumberPhoneElement = BaseElement<
  ElementType.PHONE,
  NumberPhoneConfig
>;

export type DropdownElement = BaseElement<ElementType.DROPDOWN, DropdownConfig>;

export type SingleChoiceElement = BaseElement<
  ElementType.SINGLE_CHOICE,
  SingleChoiceConfig
>;
export type TimeInputElement = BaseElement<ElementType.TIME, TimeInputConfig>;

export type DatePickerElement = BaseElement<
  ElementType.DATEPICKER,
  DatePickerConfig
>;

export type MultipleChoiceElement = BaseElement<
  ElementType.MULTIPLE_CHOICE,
  MultipleChoiceConfig
>;

export type ElementItem =
  | HeadingElement
  | FullnameElement
  | EmailElement
  | ShortTextElement
  | LongTextElement
  | SubmitElement
  | ScaleRatingElement
  | AddressElement
  | DropdownElement
  | SingleChoiceElement
  | MultipleChoiceElement
  | AddressElement
  | NumberPhoneElement
  | DatePickerElement
  | TimeInputElement;
