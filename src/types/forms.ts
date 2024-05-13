import { ElementItem } from '.';

export enum FormType {
  All = 'all',
  Shared = 'shared',
  Owned = 'owned',
}

export interface GetFormsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isDeleted?: number;
  isFavourite?: number;
  formType?: FormType;
  sortField?: string;
  sortDirection?: string;
  folderId?: string;
  teamId?: string;
}

export interface FormResponse {
  id: string;
  title: string;
  logoUrl: string;
  settings: object;
  elements: ElementItem[];
  totalSubmissions: number;
  permissions: {
    [key: string]: string[];
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  creatorId: string;
  teamId: string;
  folderId: string;
  folder: {
    id: string;
    name: string;
  };
  favouritedByUsers: {
    id: string;
    email: string;
  };
  isFavourite: boolean;
  disabled: boolean;
  disabledOnSpecificDate: boolean;
  specificDate: Date;
  disabledNotification: boolean;
}

export interface GetFormsResponse {
  forms: FormResponse[];
  page: number;
  pageSize: number;
  totalForms: number;
  totalPages: number;
}

export interface FormRequest {
  id?: string;
  disabled?: boolean;
  title: string;
  logoUrl: string;
  settings: object;
  elements: ElementItem[];
  createdAt: string;
  updatedAt: string;
}
