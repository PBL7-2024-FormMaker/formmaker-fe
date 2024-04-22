import { useMemo, useState } from 'react';
import { FaFolderPlus, FaTableCells } from 'react-icons/fa6';
import { IoTrash } from 'react-icons/io5';
import { MdDriveFileMoveRtl } from 'react-icons/md';
import { RiTeamFill } from 'react-icons/ri';
import { TbRestore } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { Box, Text } from '@mantine/core';

import { Button } from '@/atoms/Button';
import { PATH } from '@/constants';
import { MESSAGES } from '@/constants/messages';
import { useOverviewContext } from '@/contexts';
import { AddToFolderModal } from '@/molecules/AddToFolderModal';
import { ConfirmationModal } from '@/molecules/ComfirmationModal';
import { MoveToTeamModal } from '@/molecules/MoveToTeamModal';
import {
  useDeleteFormMutation,
  useRemoveFromTeamMutation,
  useRestoreFormMutation,
} from '@/redux/api/formApi';
import { ModalType, ModalTypes } from '@/types';
import { countSuccessAndErrors, toastify } from '@/utils';

interface ActionListFormProps {
  selectedFormIds: number[];
}

export const ActionList = ({ selectedFormIds }: ActionListFormProps) => {
  const navigate = useNavigate();

  const { activeTeam, selectedRecords, setSelectedRecords } =
    useOverviewContext();

  const [deleteForm, { isLoading: isDeletingForm }] = useDeleteFormMutation();

  const [restoreForm] = useRestoreFormMutation();

  const [removeFromTeam, { isLoading: isRemovingFromTeam }] =
    useRemoveFromTeamMutation();

  const [modalType, setModalType] = useState<ModalType | ''>('');
  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType('');

  const handleViewSubmissions = () => {
    navigate(
      PATH.RESPONSE_PAGE.replace(':formId', selectedFormIds[0].toString()),
    );
  };

  const handleDeleteMultipleForms = async () => {
    await Promise.allSettled(
      selectedFormIds.map((id) => deleteForm({ id })),
    ).then((response) => {
      const { successCount, errorCount } = countSuccessAndErrors(response);
      if (successCount === response.length) {
        toastify.displaySuccess(MESSAGES.DELETE_FORM_SUCCESS);
        closeModal();
      } else if (errorCount > 0) {
        toastify.displayError(`${errorCount} form(s) failed to delete`);
      }
      setSelectedRecords([]);
    });
  };

  const handleRestoreMultipleForms = async () => {
    await Promise.allSettled(
      selectedFormIds.map((id) => restoreForm({ id })),
    ).then((response) => {
      const { successCount, errorCount } = countSuccessAndErrors(response);
      if (successCount === response.length) {
        toastify.displaySuccess(MESSAGES.RESTORE_FORM_SUCCESS);
        closeModal();
      } else if (errorCount > 0) {
        toastify.displayError(`${errorCount} form(s) failed to restore`);
      }
      setSelectedRecords([]);
    });
  };

  const handleRemoveMultipleFormsFromTeam = async () => {
    await Promise.allSettled(
      selectedRecords.map((form) =>
        removeFromTeam({ formId: form.id, teamId: form.teamId }),
      ),
    ).then((response) => {
      const { successCount, errorCount } = countSuccessAndErrors(response);
      if (successCount === response.length) {
        toastify.displaySuccess(MESSAGES.REMOVE_FROM_TEAM_SUCCESS);
        closeModal();
      } else if (errorCount > 0) {
        toastify.displayError(
          `${errorCount} form(s) failed to moved back to My Forms`,
        );
      }
      setSelectedRecords([]);
    });
  };

  const isFormsInTrash =
    selectedRecords.findIndex((form) => form.deletedAt !== null) !== -1;

  const SingleFormActions = [
    {
      icon: <FaTableCells size={24} />,
      title: 'Submissions',
      onClick: handleViewSubmissions,
    },
    {
      icon: <FaFolderPlus size={24} />,
      title: 'Add to Folder',
      onClick: () => {
        openModal(ModalTypes.ADD_TO_FOLDER);
      },
    },
    {
      icon: <RiTeamFill size={24} />,
      title: activeTeam === -1 ? 'Move to Team' : 'Move to My Forms',
      onClick: () => {
        if (activeTeam === -1) {
          openModal(ModalTypes.MOVE_TO_TEAM);
          return;
        }
        openModal(ModalTypes.REMOVE_FROM_TEAM);
      },
    },
    {
      icon: <IoTrash size={24} />,
      title: 'Delete',
      onClick: handleDeleteMultipleForms,
    },
  ];

  const MultipleFormActions = [
    {
      icon: <FaFolderPlus size={24} />,
      title: 'Add to folder',
      onClick: () => {
        openModal(ModalTypes.ADD_TO_FOLDER);
      },
    },
    {
      icon: <RiTeamFill size={24} />,
      title: activeTeam === -1 ? 'Move to Team' : 'Move to My Forms',
      onClick: () => {
        if (activeTeam === -1) {
          openModal(ModalTypes.MOVE_TO_TEAM);
          return;
        }
        openModal(ModalTypes.REMOVE_FROM_TEAM);
      },
    },
    {
      icon: <IoTrash size={24} />,
      title: 'Delete',
      onClick: handleDeleteMultipleForms,
    },
  ];

  const FormInTrashActions = [
    {
      icon: <IoTrash size={24} />,
      title: 'Purge',
      onClick: () => {
        openModal(ModalTypes.DELETE_FORM_PERMANENTLY);
      },
    },
    {
      icon: <TbRestore size={24} />,
      title: 'Restore',
      onClick: handleRestoreMultipleForms,
    },
  ];

  const actionList = useMemo(() => {
    if (isFormsInTrash) {
      return FormInTrashActions;
    }
    if (selectedFormIds.length > 1) {
      return MultipleFormActions;
    } else {
      return SingleFormActions;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormsInTrash, selectedFormIds]);

  return (
    <div className='flex items-center justify-between gap-2'>
      {actionList.map((action, index) => (
        <Button
          className='text-sm font-medium'
          size='md'
          key={index}
          variant='outline'
          color={
            action.title === 'Delete' || action.title === 'Purge'
              ? 'error'
              : 'primary'
          }
          onClick={() => action.onClick()}
          leftSection={action.icon}
          title={action.title}
        />
      ))}

      <AddToFolderModal
        opened={modalType === ModalTypes.ADD_TO_FOLDER}
        onClose={closeModal}
        closeModal={closeModal}
        selectedFormIds={selectedFormIds}
      />
      <MoveToTeamModal
        opened={modalType === ModalTypes.MOVE_TO_TEAM}
        onClose={closeModal}
        closeModal={closeModal}
        selectedFormIds={selectedFormIds}
      />
      <ConfirmationModal
        size='lg'
        body={
          <Box className='flex flex-col items-center gap-3 px-10 py-5'>
            <IoTrash size={70} className='text-error' />
            <Text size='lg' className='font-bold'>
              Delete Form
            </Text>
            <Text className='text-center'>
              Selected form(s) and all of its submissions will be deleted
              permanently. This operation cannot be undone.
            </Text>
          </Box>
        }
        opened={modalType === ModalTypes.DELETE_FORM_PERMANENTLY}
        onClose={closeModal}
        onClickBack={closeModal}
        onClickConfirm={handleDeleteMultipleForms}
        isLoading={isDeletingForm}
      />
      <ConfirmationModal
        size='lg'
        body={
          <Box className='flex flex-col items-center gap-3 px-10 py-5'>
            <MdDriveFileMoveRtl size={70} className='text-blue-500' />
            <Text size='lg' className='font-bold'>
              Move to My Forms
            </Text>
            <Text className='text-center'>
              The team members will no longer access selected form(s).
            </Text>
          </Box>
        }
        opened={modalType === ModalTypes.REMOVE_FROM_TEAM}
        onClose={closeModal}
        onClickBack={closeModal}
        onClickConfirm={handleRemoveMultipleFormsFromTeam}
        confirmButtonProps={{
          title: 'Move Now',
          className: 'bg-blue-500 hover:bg-blue-600',
        }}
        isLoading={isRemovingFromTeam}
      />
    </div>
  );
};
