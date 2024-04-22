import { ElementItem } from '.';

export interface GetFormsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isDeleted?: number;
  isFavourite?: number;
  sortField?: string;
  sortDirection?: string;
  folderId?: number;
  teamId?: number;
}

export interface FormResponse {
  id: number;
  title: string;
  logoUrl: string;
  settings: object;
  elements: ElementItem[];
  totalSubmissions: number;
  permissions: object;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  creatorId: number;
  teamId: number;
  folderId: number;
  folder: {
    id: number;
    name: string;
  };
  favouritedByUsers: {
    id: number;
    email: string;
  };
  isFavourite: boolean;
  disabled: boolean;
}

export interface GetFormsResponse {
  forms: FormResponse[];
  page: number;
  pageSize: number;
  totalForms: number;
  totalPages: number;
}

export interface FormRequest {
  id?: number;
  disabled?: boolean;
  title: string;
  logoUrl: string;
  settings: object;
  elements: ElementItem[];
  createdAt: string;
  updatedAt: string;
}
