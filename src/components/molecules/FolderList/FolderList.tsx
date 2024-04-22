import { FaFolder } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { RiAddBoxFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Box, Group, Menu, NavLink, Text } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

import { PATH } from '@/constants';
import { defaultFormsParams } from '@/constants/defaultFormsParams';
import { useFormParams, useOverviewContext } from '@/contexts';
import {
  useDeleteFolderMutation,
  useUpdateFolderMutation,
} from '@/redux/api/folderApi';
import {
  ErrorResponse,
  FolderResponse,
  type ModalType,
  ModalTypes,
  TeamResponse,
} from '@/types';
import { cn, toastify } from '@/utils';

import { ConfirmationModal } from '../ComfirmationModal';
import { Loader } from '../Loader';
import { ManageFolderModal } from '../ManageFolderModal';

interface FolderListProps {
  folderList?: FolderResponse[] | TeamResponse['folders'];
  isLoading: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  setFolderName: (folderName: string) => void;
  setFolderId: (folderId: number) => void;
  modalType: ModalType | '';
  folderName: string;
  folderId: number;
  teamId?: number;
}

export const FolderList = ({
  openModal,
  closeModal,
  setFolderName,
  setFolderId,
  modalType,
  folderName,
  folderId,
  teamId,
  folderList,
  isLoading,
}: FolderListProps) => {
  const {
    activeFolder,
    setActiveFolder,
    activeAllForms,
    setActiveAllForms,
    setActiveTeam,
    setSelectedRecords,
  } = useOverviewContext();

  const navigate = useNavigate();

  const { setParams } = useFormParams();

  const [updateFolder, { isLoading: isFolderUpdating }] =
    useUpdateFolderMutation();
  const [deleteFolder, { isLoading: isFolderDeleting }] =
    useDeleteFolderMutation();

  const handleUpdateFolder = () => {
    updateFolder({ id: folderId, data: { name: folderName } }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data.message as string);
        closeModal();
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  const handleDeleteFolder = () => {
    deleteFolder(folderId).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data.message as string);
        setActiveAllForms(true);
        setActiveFolder(-1);
        setParams({ ...defaultFormsParams });

        closeModal();
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  return (
    <Box className='flex flex-col justify-between gap-2'>
      {isLoading ? (
        <Loader color='green' />
      ) : (
        folderList?.map((folder) => {
          const isActiveFolder = folder.id === activeFolder;
          return (
            <Group
              key={uuidv4()}
              className={cn(
                'group cursor-pointer justify-between gap-0 rounded-md pr-2 text-slate-600 hover:bg-slate-200',
                {
                  'bg-slate-300 hover:bg-slate-300':
                    isActiveFolder && !activeAllForms,
                },
              )}
            >
              <NavLink
                key={folder.id}
                className={cn(
                  'w-[85%] rounded-md text-slate-600 hover:bg-slate-200',
                  {
                    'bg-slate-300 hover:bg-slate-300':
                      isActiveFolder && !activeAllForms,
                  },
                )}
                onClick={() => {
                  setActiveFolder(folder.id);
                  setActiveTeam(teamId || -1);
                  setActiveAllForms(false);
                  setSelectedRecords([]);
                  setParams({
                    ...defaultFormsParams,
                    teamId,
                    folderId: folder.id,
                  });
                }}
                classNames={{
                  label: 'text-sm font-semibold',
                }}
                label={folder.name}
                active={isActiveFolder && !activeAllForms}
                leftSection={<FaFolder size={16} />}
              />
              <Menu position='bottom-start' withArrow trigger='click'>
                <Menu.Target>
                  <Box className='flex'>
                    <PiDotsThreeOutlineVerticalFill
                      size={18}
                      className='cursor-pointer rounded-md text-slate-600 transition-all duration-[50ms] ease-linear'
                    />
                  </Box>
                </Menu.Target>
                <Menu.Dropdown className='min-w-[180px] !bg-malachite-100'>
                  <Menu.Item
                    className='mb-1 mt-0.5 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-malachite-400 hover:text-white'
                    leftSection={<RiAddBoxFill />}
                    onClick={() =>
                      navigate(PATH.BUILD_FORM_PAGE, {
                        state: { folderId: folder.id, teamId },
                      })
                    }
                  >
                    Add new form
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      openModal(ModalTypes.UPDATE_FOLDER);
                      setFolderName(folder.name);
                      setFolderId(folder.id);
                    }}
                    className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-malachite-400 hover:text-white'
                    leftSection={<MdEdit />}
                  >
                    Change name
                  </Menu.Item>
                  <Menu.Item
                    className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-malachite-400 hover:text-white'
                    leftSection={<MdDelete />}
                    onClick={() => {
                      openModal(ModalTypes.DELETE_FOLDER);
                      setFolderId(folder.id);
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          );
        })
      )}
      <ManageFolderModal
        opened={modalType === ModalTypes.UPDATE_FOLDER}
        onClose={closeModal}
        folderName={folderName}
        folderId={folderId}
        setFolderName={setFolderName}
        onClickCancel={closeModal}
        onClickSubmit={handleUpdateFolder}
        isLoading={isFolderUpdating}
      />
      <ConfirmationModal
        size='lg'
        body={
          <Box className='flex flex-col items-center gap-3 px-10 py-5 text-center'>
            <IoIosWarning className='size-28 text-error' />
            <Text size='lg' className='font-bold'>
              Delete folder
            </Text>
            <Text className='text-sm leading-6'>
              Are you sure you want to delete this folder? <br />
              This folder and all forms in the folder will be deleted
              permanently.
            </Text>
          </Box>
        }
        opened={modalType === ModalTypes.DELETE_FOLDER}
        onClose={closeModal}
        onClickBack={closeModal}
        onClickConfirm={handleDeleteFolder}
        isLoading={isFolderDeleting}
      />
    </Box>
  );
};
