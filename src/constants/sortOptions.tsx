import { ReactNode } from 'react';
import { FaArrowDownShortWide } from 'react-icons/fa6';
import { FaArrowUpShortWide } from 'react-icons/fa6';

export interface SortOption {
  field: string;
  sortDirection: string;
  title: string;
  icon: ReactNode;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export const sortOptionList: SortOption[] = [
  {
    field: 'title',
    sortDirection: SortDirection.ASC,
    title: 'Title',
    icon: <FaArrowUpShortWide />,
  },
  {
    field: 'title',
    sortDirection: SortDirection.DESC,
    title: 'Title',
    icon: <FaArrowDownShortWide />,
  },
  {
    field: 'createdAt',
    sortDirection: SortDirection.ASC,
    title: 'Date created',
    icon: <FaArrowUpShortWide />,
  },
  {
    field: 'createdAt',
    sortDirection: SortDirection.DESC,
    title: 'Date created',
    icon: <FaArrowDownShortWide />,
  },
  {
    field: 'updatedAt',
    sortDirection: SortDirection.ASC,
    title: 'Last edit',
    icon: <FaArrowUpShortWide />,
  },
  {
    field: 'updatedAt',
    sortDirection: SortDirection.DESC,
    title: 'Last edit',
    icon: <FaArrowDownShortWide />,
  },
];
