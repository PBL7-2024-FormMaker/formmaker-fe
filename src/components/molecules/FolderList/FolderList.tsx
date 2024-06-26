import { FaFolder } from 'react-icons/fa';
import { FaDroplet } from 'react-icons/fa6';
import { IoIosWarning } from 'react-icons/io';
import { MdDelete, MdEdit } from 'react-icons/md';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { RiAddBoxFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Box, ColorPicker, Group, Menu, NavLink, Text } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

import { PATH } from '@/constants';
import { BUTTON_COLORS } from '@/constants/buttonStyles';
import { defaultFormsParams } from '@/constants/defaultFormsParams';
import {
  useBuildFormContext,
  useFormParams,
  useOverviewContext,
} from '@/contexts';
import {
  useDeleteFolderMutation,
  useUpdateFolderMutation,
} from '@/redux/api/folderApi';
import {
  useCreateFormInFolderMutation,
  useCreateFormInFolderOfTeamMutation,
} from '@/redux/api/formApi';
import {
  ErrorResponse,
  FolderResponse,
  type ModalType,
  ModalTypes,
  TeamResponse,
} from '@/types';
import { cn, toastify } from '@/utils';
import { separateFields } from '@/utils/seperates';

import { ConfirmationModal } from '../ComfirmationModal';
import { Loader } from '../Loader';
import { ManageFolderModal } from '../ManageFolderModal';

interface FolderListProps {
  folderList?: FolderResponse[] | TeamResponse['folders'];
  isLoading: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  setFolderName: (folderName: string) => void;
  setFolderId: (folderId: string) => void;
  modalType: ModalType | '';
  folderName: string;
  folderId: string;
  teamId?: string;
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
    activeTeam,
    setActiveAllForms,
    setActiveTeam,
    setSelectedRecords,
  } = useOverviewContext();

  const navigate = useNavigate();

  const { setParams, setCurrentPage } = useFormParams();
  const { form } = useBuildFormContext();

  const [createFormInFolder, { isLoading: isCreatingFormInFolder }] =
    useCreateFormInFolderMutation();
  const [
    createFormInFolderOfTeam,
    { isLoading: isCreatingFormInFolderOfTeam },
  ] = useCreateFormInFolderOfTeamMutation();
  const [updateFolder, { isLoading: isFolderUpdating }] =
    useUpdateFolderMutation();
  const [deleteFolder, { isLoading: isFolderDeleting }] =
    useDeleteFolderMutation();

  const handleUpdateFolder = () => {
    updateFolder({ id: folderId, data: { name: folderName } }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data!.message as string);
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
        toastify.displaySuccess(res.data!.message as string);
        setActiveAllForms(true);
        setActiveFolder('');
        setParams({ ...defaultFormsParams });

        closeModal();
        return;
      }
      if (res.error as ErrorResponse)
        toastify.displayError((res.error as ErrorResponse).message as string);
    });
  };

  const handleCreateFormInFolder = (folderId: string) => {
    const filteredForm = separateFields(form);

    return createFormInFolder({ folderId, data: filteredForm }).then((res) => {
      if ('data' in res) {
        return navigate(`${PATH.BUILD_FORM_PAGE}/${res.data!.data.id}`);
      }
      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const handleCreateFormInFolderOfTeam = (folderId: string, teamId: string) => {
    const filteredForm = separateFields(form);

    return createFormInFolderOfTeam({
      folderId,
      teamId,
      data: filteredForm,
    }).then((res) => {
      if ('data' in res) {
        return navigate(`${PATH.BUILD_FORM_PAGE}/${res.data!.data.id}`, {
          state: activeTeam,
        });
      }
      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const handleCreateFormBasedOnIds = (formId: string, teamId?: string) => {
    if (teamId === undefined) {
      return handleCreateFormInFolder(formId);
    }

    return handleCreateFormInFolderOfTeam(formId, teamId);
  };

  return (
    <Box className='flex flex-col justify-between gap-2'>
      {isLoading ? (
        <Loader color='blue' />
      ) : (
        folderList?.map((folder) => {
          const isActiveFolder = folder.id === activeFolder;
          return isActiveFolder &&
            (isCreatingFormInFolder || isCreatingFormInFolderOfTeam) ? (
            <Loader color='blue' />
          ) : (
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
                  setActiveTeam(teamId ?? folder.teamId ?? '');
                  setActiveAllForms(false);
                  setSelectedRecords([]);
                  setCurrentPage(1);
                  setParams({
                    ...defaultFormsParams,
                    teamId: teamId ?? folder.teamId ?? '',
                    folderId: folder.id,
                  });
                }}
                classNames={{
                  label: 'text-sm font-semibold',
                }}
                label={folder.name}
                active={isActiveFolder && !activeAllForms}
                leftSection={
                  <FaFolder
                    size={16}
                    color={folder.color}
                    className='text-yellow-500'
                  />
                }
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
                <Menu.Dropdown className='min-w-[180px] !bg-navy-10'>
                  <Menu.Item
                    className='mb-1 mt-0.5 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
                    leftSection={<RiAddBoxFill />}
                    onClick={() => {
                      setActiveFolder(folder.id);
                      handleCreateFormBasedOnIds(folder.id, teamId);
                    }}
                  >
                    Add new form
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      openModal(ModalTypes.UPDATE_FOLDER);
                      setFolderName(folder.name);
                      setFolderId(folder.id);
                    }}
                    className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
                    leftSection={<MdEdit />}
                  >
                    Change name
                  </Menu.Item>
                  <div className='group rounded hover:bg-navy-400 hover:text-white'>
                    <Menu.Item
                      className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white group-hover:text-white'
                      leftSection={<FaDroplet />}
                    >
                      Change color
                    </Menu.Item>
                    <ColorPicker
                      value={folder.color}
                      onChange={(e) => {
                        updateFolder({
                          id: folder.id,
                          data: { name: folder.name, color: e },
                        }).then((res) => {
                          if ('data' in res) {
                            toastify.displaySuccess(
                              res.data!.message as string,
                            );
                            return;
                          }
                          if (res.error as ErrorResponse)
                            toastify.displayError(
                              (res.error as ErrorResponse).message as string,
                            );
                        });
                      }}
                      swatchesPerRow={5}
                      format='hex'
                      size='md'
                      withPicker={false}
                      className='rounded px-3 py-2 hover:bg-navy-400'
                      swatches={Object.values(BUTTON_COLORS)}
                    />
                  </div>
                  <Menu.Item
                    className='mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-navy-400 hover:text-white'
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
