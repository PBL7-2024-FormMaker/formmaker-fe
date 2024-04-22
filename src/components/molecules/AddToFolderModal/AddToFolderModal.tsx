import { useEffect, useState } from 'react';
import { FaFolderPlus } from 'react-icons/fa6';
import {
  Box,
  CheckIcon,
  ModalProps as MantineModalProps,
  Radio,
} from '@mantine/core';

import { MESSAGES } from '@/constants/messages';
import { useOverviewContext } from '@/contexts';
import { useGetMyFoldersQuery } from '@/redux/api/folderApi';
import { useAddToFolderMutation } from '@/redux/api/formApi';
import { useGetTeamDetailsQuery } from '@/redux/api/teamApi';
import { FolderInTeamResponse, FolderResponse } from '@/types';
import { countSuccessAndErrors, toastify } from '@/utils';

import { Modal } from '../Modal';

interface AddToFolderModalProps extends MantineModalProps {
  closeModal: () => void;
  selectedFormIds: number[];
}

export const AddToFolderModal = ({
  closeModal,
  selectedFormIds,
  ...props
}: AddToFolderModalProps) => {
  const { activeTeam, selectedRecords, setSelectedRecords } =
    useOverviewContext();

  const disabledFolderOptions = selectedRecords.map(
    (form) => form.folderId && form.folderId.toString(),
  );

  const { data: folders } = useGetMyFoldersQuery();

  const { data: team } = useGetTeamDetailsQuery(
    { id: activeTeam },
    { skip: activeTeam === -1 },
  );

  const [folderList, setFolderList] = useState<
    FolderResponse[] | FolderInTeamResponse[] | undefined
  >();

  useEffect(() => {
    if (activeTeam === -1) {
      setFolderList(folders);
      return;
    }
    if (team) {
      setFolderList(team.folders);
    }
  }, [team, folders, activeTeam]);

  const [addToFolder, { isLoading: isAddingToFolder }] =
    useAddToFolderMutation();

  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  const handleAddToFolder = async () => {
    await Promise.allSettled(
      selectedFormIds.map((id) =>
        addToFolder({ formId: id, folderId: Number(selectedFolderId) }),
      ),
    ).then((response) => {
      const { successCount, errorCount } = countSuccessAndErrors(response);
      if (successCount === response.length) {
        toastify.displaySuccess(MESSAGES.ADD_FORM_TO_FOLDER_SUCCESS);
        closeModal();
      } else if (errorCount > 0) {
        toastify.displayError(`${errorCount} form(s) failed to add to folder`);
      }
      setSelectedRecords([]);
    });
  };

  return (
    <Modal
      {...props}
      headerIcon={<FaFolderPlus className='text-white' />}
      headerTitle='Add to folder'
      body={
        <Box className='px-3 py-8'>
          <Radio.Group
            defaultValue={''}
            value={selectedFolderId}
            onChange={(value: string) => {
              setSelectedFolderId(value);
            }}
            name='folderOption'
            label='Select a folder below'
            classNames={{ label: 'text-base font-semibold' }}
            className='flex flex-col justify-between gap-4'
          >
            <Box className='flex flex-col items-start justify-between gap-4'>
              {folderList?.map((folder) => (
                <Radio
                  key={folder.id}
                  value={folder.id.toString()}
                  label={folder.name}
                  icon={CheckIcon}
                  color='green'
                  size='sm'
                  disabled={disabledFolderOptions.includes(
                    folder.id.toString(),
                  )}
                />
              ))}
            </Box>
          </Radio.Group>
        </Box>
      }
      onClickCancel={closeModal}
      onClickSubmit={() => handleAddToFolder()}
      isLoading={isAddingToFolder}
    />
  );
};
