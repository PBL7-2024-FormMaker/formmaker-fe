import { GetFormsParams } from '@/types';

import { sortOptionList } from './sortOptions';

export const DEFAULT_PAGE_SIZE = 10;

export const defaultFormsParams: GetFormsParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  sortField: sortOptionList[3].field,
  sortDirection: sortOptionList[3].sortDirection,
  isDeleted: 0,
  isFavourite: 0,
  search: '',
  folderId: undefined,
  teamId: undefined,
};
