import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { FormRequest } from '@/types';

import { DEFAULT_ELEMENTS } from './elementLayoutContext';

interface BuildFormContextType {
  form: FormRequest;
  setForm: React.Dispatch<React.SetStateAction<FormRequest>>;
  currentLogo: string;
  setCurrentLogo: React.Dispatch<React.SetStateAction<string>>;
  currentTitle: string;
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
  toggledLeftbar: boolean;
  setToggledLeftbar: React.Dispatch<React.SetStateAction<boolean>>;
  toggledRightbar: boolean;
  setToggledRightbar: React.Dispatch<React.SetStateAction<boolean>>;
  previewMode: boolean;
  setPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  canUpdateForm: boolean;
  setCanUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  initLogo: string;
  initTitle: string;
  isEditForm: boolean;
  isPublishSection: boolean;
  isSettingsSection: boolean;
  isEmailsSettingPage: boolean;
  isGeneralSettingPage: boolean;
}

export const initFormRequestState: FormRequest = {
  title: 'Form',
  logoUrl: '',
  settings: {},
  elements: DEFAULT_ELEMENTS,
  updatedAt: '',
  createdAt: '',
};

export const DEFAULT_FORM_TITLE = 'Form';

const BuildFormContext = createContext<BuildFormContextType>({
  form: initFormRequestState,
  setForm: () => {},
  currentLogo: '',
  setCurrentLogo: () => {},
  currentTitle: '',
  setCurrentTitle: () => {},
  toggledLeftbar: false,
  setToggledLeftbar: () => {},
  toggledRightbar: false,
  setToggledRightbar: () => {},
  previewMode: false,
  setPreviewMode: () => {},
  canUpdateForm: false,
  setCanUpdateForm: () => {},
  isEditForm: false,
  initLogo: '',
  initTitle: '',
  isPublishSection: false,
  isSettingsSection: false,
  isEmailsSettingPage: false,
  isGeneralSettingPage: true,
});

export const BuildFormContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { id: formId } = useParams();
  const { pathname } = useLocation();

  const isEditForm = Boolean(formId);
  const isPublishSection = pathname.includes('publish');
  const isSettingsSection = pathname.includes('settings');
  const isEmailsSettingPage = pathname.includes('emails');
  const isGeneralSettingPage = pathname.includes('general');
  const [form, setForm] = useState<FormRequest>(initFormRequestState);
  const [currentLogo, setCurrentLogo] = useState<string>('');
  const [currentTitle, setCurrentTitle] = useState<string>(DEFAULT_FORM_TITLE);
  const [toggledLeftbar, setToggledLeftbar] = useState<boolean>(false);
  const [toggledRightbar, setToggledRightbar] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(
    pathname.includes('preview'),
  );
  const [canUpdateForm, setCanUpdateForm] = useState<boolean>(false);

  const { data } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId || !pathname.includes('build') },
  );

  const initLogo = data?.logoUrl || '';
  const initTitle = data?.title || DEFAULT_FORM_TITLE;

  useEffect(() => {
    if (!data) return;
    setForm((prev) => ({ ...prev, ...data }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <BuildFormContext.Provider
      value={{
        form,
        setForm,
        currentLogo,
        setCurrentLogo,
        currentTitle,
        setCurrentTitle,
        toggledLeftbar,
        setToggledLeftbar,
        toggledRightbar,
        setToggledRightbar,
        previewMode,
        setPreviewMode,
        canUpdateForm,
        setCanUpdateForm,
        isEditForm,
        initLogo,
        initTitle,
        isPublishSection,
        isSettingsSection,
        isEmailsSettingPage,
        isGeneralSettingPage,
      }}
    >
      {children}
    </BuildFormContext.Provider>
  );
};

export const useBuildFormContext = () => useContext(BuildFormContext);
