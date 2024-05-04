import React, { createContext, ReactNode, useContext, useState } from 'react';

import { FormResponse } from '@/types';

interface OverviewContextType {
  activeFolder: string;
  setActiveFolder: React.Dispatch<React.SetStateAction<string>>;
  activeAllForms: boolean;
  setActiveAllForms: React.Dispatch<React.SetStateAction<boolean>>;
  activeTeam: string;
  setActiveTeam: React.Dispatch<React.SetStateAction<string>>;
  selectedRecords: FormResponse[];
  setSelectedRecords: React.Dispatch<React.SetStateAction<FormResponse[]>>;
}

const OverviewContext = createContext<OverviewContextType>({
  activeFolder: '',
  setActiveFolder: () => {},
  activeAllForms: true,
  setActiveAllForms: () => {},
  activeTeam: '',
  setActiveTeam: () => {},
  selectedRecords: [],
  setSelectedRecords: () => {},
});

export const OverviewContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeFolder, setActiveFolder] = useState<string>('');
  const [activeAllForms, setActiveAllForms] = useState<boolean>(true);
  const [activeTeam, setActiveTeam] = useState<string>('');
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
