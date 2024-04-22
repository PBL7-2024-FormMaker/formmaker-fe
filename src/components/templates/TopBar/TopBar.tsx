import { useMemo, useState } from 'react';
import { IoIosWarning } from 'react-icons/io';
import { LuExternalLink } from 'react-icons/lu';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Group,
  Tabs as MantineTabs,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import _isEqual from 'lodash.isequal';

import { ToggleButton } from '@/atoms/Button/ToggleButton';
import {
  DEFAULT_ELEMENTS,
  DEFAULT_FORM_TITLE,
  initFormRequestState,
  useBuildFormContext,
  useElementLayouts,
} from '@/contexts';
import { ConfirmationModal } from '@/molecules/ComfirmationModal';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { ElementItem } from '@/types';

const tabList = [
  { title: 'Build', value: '/' },
  { title: 'Publish', value: 'publish' },
];

export const TopBar = () => {
  const {
    isEditForm,
    isPublishSection,
    form,
    setForm,
    previewMode,
    setPreviewMode,
    setCurrentLogo,
    setCurrentTitle,
    initLogo,
    initTitle,
  } = useBuildFormContext();

  const { setElements } = useElementLayouts();

  const [opened, { open: openConfirmModal, close: closeConfirmModal }] =
    useDisclosure(false);

  const [selectedTabValue, setSelectedTabValue] = useState<string | null>(
    tabList[0].value,
  );

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { id: formId } = useParams();

  const { data: formData } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );

  const haveUnsavedChanges = useMemo(
    () => !isEditForm || !_isEqual(formData, form),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEditForm, form],
  );

  const formURL = isEditForm ? `${window.location.origin}/form/${form.id}` : '';

  const handleChangeTab = (value: string | null) => {
    if (value === tabList[1].value && !isPublishSection) {
      if (haveUnsavedChanges) {
        openConfirmModal();
        return;
      }
      setSelectedTabValue(value);
      navigate(pathname.concat(`/${value}`));
      return;
    }
    if (value === tabList[0].value && isPublishSection) {
      setSelectedTabValue(value);
      navigate(pathname.replace('/publish', ''));
      return;
    }
  };

  const handleClickPreviewButton = () => {
    if (!previewMode && haveUnsavedChanges) {
      openConfirmModal();
      return;
    }
    setPreviewMode((prevState) => !prevState);
    previewMode
      ? navigate(pathname.replace('/preview', ''))
      : navigate(pathname.concat('/preview'));
  };

  const handleDiscardChanges = () => {
    if (isEditForm) {
      setForm({ ...initFormRequestState, ...formData });
      setElements([...(formData?.elements as ElementItem[])]);
    } else {
      setForm({
        ...initFormRequestState,
        title: DEFAULT_FORM_TITLE,
        elements: DEFAULT_ELEMENTS,
      });
      setElements(DEFAULT_ELEMENTS);
    }
    setCurrentTitle(initTitle);
    setCurrentLogo(initLogo);
    closeConfirmModal();
  };

  return (
    <>
      {previewMode ? (
        <Box className='relative flex h-[50px] items-center justify-start gap-0 bg-gradient-to-r from-malachite-400 to-malachite-600 pl-10'>
          <Group className='max-w-[300px] flex-1 items-center justify-between gap-0'>
            <input
              value={formURL}
              className='h-[28px] flex-1 rounded-l-[4px] border-none px-3 py-[5px] text-xs outline-none'
              readOnly
            />
            <ActionIcon
              component='button'
              aria-label='Open in a new tab'
              onClick={() => {
                window.open(formURL, '_blank');
              }}
              className='rounded-l-none rounded-r-[4px]'
              disabled={!isEditForm}
            >
              <LuExternalLink />
            </ActionIcon>
          </Group>
          <ToggleButton
            label='Preview form'
            className='absolute right-10 top-[50%] -translate-y-1/2 text-sm text-white'
            isEnable={previewMode}
            handleToggleButton={handleClickPreviewButton}
          />
        </Box>
      ) : (
        <MantineTabs
          color='#8ad56c'
          variant='pills'
          value={selectedTabValue}
          classNames={{ tabLabel: 'uppercase' }}
          onChange={(value: string | null) => handleChangeTab(value)}
          className='relative'
        >
          <MantineTabs.List className='h-[50px] justify-center gap-0 bg-gradient-to-r from-malachite-400 to-malachite-600'>
            {tabList.map((tab, index) => (
              <MantineTabs.Tab
                key={index}
                value={tab.value}
                className='h-full min-w-40 rounded-[0] px-8 text-lg text-white duration-150 hover:bg-activeTabBackground'
              >
                {tab.title}
              </MantineTabs.Tab>
            ))}
          </MantineTabs.List>
          <ToggleButton
            label='Preview form'
            className='absolute right-10 top-[50%] -translate-y-1/2 text-sm text-white'
            isEnable={previewMode}
            handleToggleButton={handleClickPreviewButton}
          />
        </MantineTabs>
      )}
      <ConfirmationModal
        size={formId ? 'xl' : 'lg'}
        body={
          formId ? (
            <Box className='flex flex-col items-center gap-3 px-10'>
              <IoIosWarning className='size-28 text-red-500' />
              <Text size='lg' className='font-bold'>
                Unsaved Changes
              </Text>
              <Text className='text-center text-[15px]'>
                You have made changes that haven't been saved yet.
                <br />
                These changes will be lost if you leave the page without saving
                them.
                <br />
                Are you sure you want to discard changes?
              </Text>
            </Box>
          ) : (
            <Box className='flex flex-col items-center gap-3 px-10'>
              <IoIosWarning className='size-24 text-yellow-500' />
              <Text size='lg' className='font-bold'>
                Uncreated Form
              </Text>
              <Text className='text-center text-[15px]'>
                Your form hasn't been created yet. <br />
                Please make sure to save this form before leave the page.
              </Text>
            </Box>
          )
        }
        opened={opened}
        onClose={closeConfirmModal}
        onClickBack={closeConfirmModal}
        onClickConfirm={handleDiscardChanges}
        backButtonProps={{
          title: 'Keep editing',
          className: !formId ? 'hidden' : '',
        }}
        confirmButtonProps={{
          title: 'Discard changes',
          className: !formId ? 'hidden' : 'bg-red-500 hover:bg-red-600',
        }}
        isLoading={false}
      />
    </>
  );
};
