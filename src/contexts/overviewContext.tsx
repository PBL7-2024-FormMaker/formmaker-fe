import React, { createContext, ReactNode, useContext, useState } from 'react';

import { FormResponse } from '@/types';

interface OverviewContextType {
  activeFolder: number;
  setActiveFolder: React.Dispatch<React.SetStateAction<number>>;
  activeAllForms: boolean;
  setActiveAllForms: React.Dispatch<React.SetStateAction<boolean>>;
  activeTeam: number;
  setActiveTeam: React.Dispatch<React.SetStateAction<number>>;
  selectedRecords: FormResponse[];
  setSelectedRecords: React.Dispatch<React.SetStateAction<FormResponse[]>>;
}

const OverviewContext = createContext<OverviewContextType>({
  activeFolder: -1,
  setActiveFolder: () => {},
  activeAllForms: true,
  setActiveAllForms: () => {},
  activeTeam: -1,
  setActiveTeam: () => {},
  selectedRecords: [],
  setSelectedRecords: () => {},
});

export const OverviewContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeFolder, setActiveFolder] = useState<number>(-1);
  const [activeAllForms, setActiveAllForms] = useState<boolean>(true);
  const [activeTeam, setActiveTeam] = useState<number>(-1);
  const [selectedRecords, setSelectedRecords] = useState<FormResponse[]>([]);

  return (
    <OverviewContext.Provider
      value={{
        activeFolder,
        setActiveFolder,
        activeAllForms,
        setActiveAllForms,
        activeTeam,
        setActiveTeam,
        selectedRecords,
        setSelectedRecords,
      }}
    >
      {children}
    </OverviewContext.Provider>
  );
};

export const useOverviewContext = () => useContext(OverviewContext);
