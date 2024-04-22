export interface FormAnswer {
  elementId: string;
  answers: FieldAnswer[];
}

export interface FieldAnswer {
  fieldId: string;
  text: string;
}
export interface FormAnswerRequest {
  formAnswers: FormAnswer[];
}

export interface FormAnswerResponse {
  id: number;
  formAnswers: FormAnswer[];
  createdAt: string;
  deletedAt: string;
  formId: number;
}

export interface GetResponsesParams {
  page?: number;
  pageSize?: number;
  searchText?: string;
  sortField?: string;
  sortDirection?: string;
  fieldsFilter?: string;
}

export interface RawResponseRow {
  formAnswers: RawFormAnswerCell[];
  id: number;
  createdAt: Date;
}

export interface RawFormAnswerCell {
  elementId: string;
  elementName: string;
  answers: RawFieldAnswerCell[];
}

export interface RawFieldAnswerCell {
  fieldId: string;
  fieldName: string;
  text: string;
}

export interface ElementIdAndName {
  elementId: string;
  elementName: string;
}

export interface ReturnGetResponses {
  elementIdAndNameList: ElementIdAndName[];
  responses: RawResponseRow[];
  page: number;
  pageSize: number;
  totalResponses: number;
  totalPages: number;
}
