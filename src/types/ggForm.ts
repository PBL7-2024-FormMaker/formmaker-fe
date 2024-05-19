export interface shorttextGG {
  required: boolean;
  questionId: string;
  textQuestion: object;
}
export interface longTextGG {
  required: boolean;
  questionId: string;
  textQuestion: {
    paragraph: boolean;
  };
}
export interface isOther {
  isOther: boolean;
}

export interface valueOption {
  value: string;
}

export type optionChoice = isOther | valueOption;

export interface singleChoiceGG {
  required: boolean;
  choiceQuestion: {
    type: 'RADIO';
    options: optionChoice[];
  };
}
export interface multiplechoiceGG {
  required: boolean;
  questionId: string;
  choiceQuestion: {
    type: 'CHECKBOX';
    options: {
      value: string;
    }[];
  };
}

export interface dropdownGG {
  required: boolean;
  questionId: string;
  choiceQuestion: {
    type: 'DROP_DOWN';
    options: {
      value: string;
    }[];
  };
}

export interface datePickerGG {
  required: boolean;
  questionId: string;
  dateQuestion: {
    includeYear: boolean;
  };
}

export interface scaleRatingGG {
  required: boolean;
  questionId: string;
  scaleQuestion: {
    low: number;
    high: number;
    lowLabel: string;
    highLabel: string;
  };
}

export interface timeGG {
  questionId: string;
  required: boolean;
  timeQuestion: object;
}
export type questionGG =
  | shorttextGG
  | longTextGG
  | singleChoiceGG
  | multiplechoiceGG
  | dropdownGG
  | datePickerGG
  | scaleRatingGG
  | timeGG;
export interface getFormGG {
  formId: string;
  info: {
    title: string;
    description: string;
    documentTitle: string;
  };
  settings: object;
  items: {
    itemId: string;
    title: string;
    questionItem: {
      question: questionGG;
    };
  }[];
}
