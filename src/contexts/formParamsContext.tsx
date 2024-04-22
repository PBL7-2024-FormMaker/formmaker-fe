import React, { createContext, ReactNode, useContext, useState } from 'react';

import { GetFormsParams } from '@/types';

interface FormParamsContextType {
  params: GetFormsParams;
  setParams: React.Dispatch<React.SetStateAction<GetFormsParams>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  sortOptionIndex: number;
  setSortOptionIndex: React.Dispatch<React.SetStateAction<number>>;
}

const FormParamsContext = createContext<FormParamsContextType>({
  params: {},
  setParams: () => {},
  currentPage: 0,
  setCurrentPage: () => {},
  sortOptionIndex: 0,
  setSortOptionIndex: () => {},
});

export const FormParamsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [params, setParams] = useState<GetFormsParams>({});

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [sortOptionIndex, setSortOptionIndex] = useState<number>(3);

  return (
    <FormParamsContext.Provider
      value={{
        params,
        setParams,
        currentPage,
        setCurrentPage,
        sortOptionIndex,
        setSortOptionIndex,
      }}
    >
      {children}
    </FormParamsContext.Provider>
  );
};

export const useFormParams = () => useContext(FormParamsContext);
