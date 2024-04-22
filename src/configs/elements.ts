import { BiHeading } from 'react-icons/bi';
import { BsSendFill } from 'react-icons/bs';
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaFileUpload,
  FaImage,
  FaPhoneAlt,
  FaUser,
} from 'react-icons/fa';
import { FaChartSimple, FaLocationDot, FaStar, FaTable } from 'react-icons/fa6';
import { IoMdCheckbox, IoMdRadioButtonOn } from 'react-icons/io';
import { MdEmail, MdInsertPageBreak, MdWatchLater } from 'react-icons/md';
import { PiTextbox, PiTextboxBold } from 'react-icons/pi';
import { RiNumber7 } from 'react-icons/ri';
import { RxDividerHorizontal, RxDropdownMenu } from 'react-icons/rx';

import { ElementType } from '@/types';

export const ELEMENTS = {
  HEADING: {
    icon: BiHeading,
    type: ElementType.HEADING,
    isDisabled: false,
  },
  EMAIL: {
    icon: MdEmail,
    type: ElementType.EMAIL,
    isDisabled: false,
  },
  FULLNAME: {
    icon: FaUser,
    type: ElementType.FULLNAME,
    isDisabled: false,
  },
  ADDRESS: {
    icon: FaLocationDot,
    type: ElementType.ADDRESS,
    isDisabled: false,
  },
  PHONE: {
    icon: FaPhoneAlt,
    type: ElementType.PHONE,
    isDisabled: false,
  },
  DATEPICKER: {
    icon: FaCalendarAlt,
    type: ElementType.DATEPICKER,
    isDisabled: false,
  },
  APPOINTMENT: {
    icon: FaCalendarCheck,
    type: ElementType.APPOINTMENT,
    isDisabled: true,
  },
  SHORT_TEXT: {
    icon: PiTextbox,
    type: ElementType.SHORT_TEXT,
    isDisabled: false,
  },
  LONG_TEXT: {
    icon: PiTextboxBold,
    type: ElementType.LONG_TEXT,
    isDisabled: false,
  },
  DROPDOWN: {
    icon: RxDropdownMenu,
    type: ElementType.DROPDOWN,
    isDisabled: false,
  },
  SINGLE_CHOICE: {
    icon: IoMdRadioButtonOn,
    type: ElementType.SINGLE_CHOICE,
    isDisabled: false,
  },
  MULTIPLE_CHOICE: {
    icon: IoMdCheckbox,
    type: ElementType.MULTIPLE_CHOICE,
    isDisabled: false,
  },
  NUMBER: {
    icon: RiNumber7,
    type: ElementType.NUMBER,
    isDisabled: true,
  },
  IMAGE: {
    icon: FaImage,
    type: ElementType.IMAGE,
    isDisabled: true,
  },
  FILE_UPLOAD: {
    icon: FaFileUpload,
    type: ElementType.FILE_UPLOAD,
    isDisabled: true,
  },
  TIME: {
    icon: MdWatchLater,
    type: ElementType.TIME,
    isDisabled: false,
  },
  SUBMIT: {
    icon: BsSendFill,
    type: ElementType.SUBMIT,
    isDisabled: false,
  },
  INPUT_TABLE: {
    icon: FaTable,
    type: ElementType.INPUT_TABLE,
    isDisabled: true,
  },
  STAR_RATING: {
    icon: FaStar,
    type: ElementType.STAR_RATING,
    isDisabled: true,
  },
  SCALE_RATING: {
    icon: FaChartSimple,
    type: ElementType.SCALE_RATING,
    isDisabled: false,
  },
  DIVIDER: {
    icon: RxDividerHorizontal,
    type: ElementType.DIVIDER,
    isDisabled: true,
  },
  PAGE_BREAK: {
    icon: MdInsertPageBreak,
    type: ElementType.PAGE_BREAK,
    isDisabled: true,
  },
};

export const ElementList = [
  {
    title: 'Necessary elements',
    elements: [
      { element: ELEMENTS.HEADING },
      { element: ELEMENTS.EMAIL },
      { element: ELEMENTS.FULLNAME },
      { element: ELEMENTS.ADDRESS },
      { element: ELEMENTS.PHONE },
      { element: ELEMENTS.DATEPICKER },
    ],
  },
  {
    title: 'Basic elements',
    elements: [
      { element: ELEMENTS.SHORT_TEXT },
      { element: ELEMENTS.LONG_TEXT },
      { element: ELEMENTS.DROPDOWN },
      { element: ELEMENTS.SINGLE_CHOICE },
      { element: ELEMENTS.MULTIPLE_CHOICE },
      { element: ELEMENTS.TIME },
      { element: ELEMENTS.SUBMIT },
    ],
  },
  {
    title: 'Survey elements',
    elements: [{ element: ELEMENTS.SCALE_RATING }],
  },
];
