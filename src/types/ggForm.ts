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

export interface fileGG {
  questionId: string;
  required: boolean;
  fileUploadQuestion: {
    folderId: string;
    type: string[];
    maxFiles: number;
    maxFileSize: string;
  };
}

export interface inputTableRow {
  questionId: string;
  required: boolean;
  rowQuestion: { title: string };
}

export interface radioInputTableCol {
  columns: {
    type: 'RADIO';
    options: { value: string }[];
  };
}

export interface checkboxInputTableCol {
  columns: {
    type: 'CHECKBOX';
    options: { value: string }[];
  };
}
export interface radioInputTable {
  questions: inputTableRow[];
  grid: radioInputTableCol;
}

export interface checkboxInputTable {
  questions: inputTableRow[];
  grid: checkboxInputTableCol;
}

export type groupQuestionGG = radioInputTable | checkboxInputTable;

export type questionGG =
  | shorttextGG
  | longTextGG
  | singleChoiceGG
  | multiplechoiceGG
  | dropdownGG
  | datePickerGG
  | scaleRatingGG
  | timeGG
  | fileGG;
export interface getFormGG {
  formId: string;
  info: {
    title: string;
    description: string;
    documentTitle: string;
  };
  settings: object;
  items: itemsGG[];
}

export interface questionItemGG {
  itemId: string;
  title: string;
  questionItem: {
    question: questionGG;
  };
}
export interface getGroupItemsFormGG {
  itemId: string;
  title: string;
  questionGroupItem: groupQuestionGG;
}

export interface getImageItemFormGG {
  itemId: string;
  imageItem: {
    image: {
      contentUri: string;
      properties: {
        alignment: string;
        width: number;
      };
    };
  };
}

export type itemsGG = questionItemGG | getGroupItemsFormGG | getImageItemFormGG;
