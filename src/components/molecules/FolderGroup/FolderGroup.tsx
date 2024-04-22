import { useState } from 'react';
import { FaFolder, FaPlusCircle } from 'react-icons/fa';
import { Box, NavLink, Text } from '@mantine/core';

import { Button } from '@/atoms/Button';
import { defaultFormsParams } from '@/constants/defaultFormsParams';
import { useFormParams, useOverviewContext } from '@/contexts';
import { ManageFolderModal } from '@/molecules/ManageFolderModal';
import { useCreateFolderMutation } from '@/redux/api/folderApi';
import {
  ErrorResponse,
  FolderResponse,
  type ModalType,
  ModalTypes,
} from '@/types';
import { cn, toastify } from '@/utils';

import { FolderList } from '../FolderList';

interface FolderListProps {
  folderName: string;
  setFolderName: (folderName: string) => void;
  folderList?: FolderResponse[];
  isLoading: boolean;
  folderId: number;
  setFolderId: (folderId: number) => void;
}

export const FolderGroup = ({
  folderName,
  setFolderName,
  folderList,
  isLoading,
  folderId,
  setFolderId,
}: FolderListProps) => {
  const [modalType, setModalType] = useState<ModalType | ''>('');
  const {
    activeAllForms,
    setActiveAllForms,
    setActiveFolder,
    setActiveTeam,
    setSelectedRecords,
  } = useOverviewContext();
  const { setParams } = useFormParams();

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType('');
  const [createFolder, { isLoading: isFolderCreating }] =
    useCreateFolderMutation();

  const handleCreateFolder = () => {
    createFolder({ payload: { name: folderName } }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data.message as string);
        closeModal();
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  return (
    <Box className='flex flex-col gap-2'>
      <Text className='font-bold'>MY FORMS</Text>
      <NavLink
        className={cn('mt-3 rounded-md text-slate-600 hover:bg-slate-300', {
          'bg-slate-300': activeAllForms,
        })}
        classNames={{
          label: 'text-sm font-semibold',
        }}
        label='All forms'
        leftSection={<FaFolder className='text-malachite-500' />}
        active={activeAllForms}
        onClick={() => {
          setActiveAllForms(true);
          setActiveFolder(-1);
          setActiveTeam(-1);
          setSelectedRecords([]);
          setParams({ ...defaultFormsParams });
        }}
      />
      <FolderList
        openModal={openModal}
        setFolderName={setFolderName}
        setFolderId={setFolderId}
        modalType={modalType}
        closeModal={closeModal}
        folderName={folderName}
        folderId={folderId}
        folderList={folderList}
        isLoading={isLoading}
      />
      <Button
        className='h-10 rounded-md font-bold text-slate-500 hover:bg-slate-200 hover:text-slate-500'
        justify='flex-start'
        variant='subtle'
        leftSection={<FaPlusCircle className='size-4' />}
        onClick={() => {
          openModal(ModalTypes.CREATE_FOLDER);
          setFolderName('');
        }}
        title='Create a new folder'
      />
      <ManageFolderModal
        opened={modalType === ModalTypes.CREATE_FOLDER}
        onClose={closeModal}
        folderName={folderName}
        folderId={modalType === ModalTypes.CREATE_FOLDER ? undefined : folderId}
        setFolderName={setFolderName}
        onClickCancel={closeModal}
        isLoading={isFolderCreating}
        onClickSubmit={handleCreateFolder}
      />
    </Box>
  );
};
