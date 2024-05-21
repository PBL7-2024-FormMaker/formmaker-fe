import { useState } from 'react';
import { FaPlusCircle, FaStar } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoTrash } from 'react-icons/io5';
import { RiTeamFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Collapse,
  Divider,
  Group,
  LoadingOverlay,
  NavLink,
  Text,
} from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/atoms/Button';
import { defaultFormsParams } from '@/constants/defaultFormsParams';
import { PATH } from '@/constants/routes';
import {
  useBuildFormContext,
  useFormParams,
  useOverviewContext,
} from '@/contexts';
import { FolderList } from '@/molecules/FolderList';
import { ManageFolderModal } from '@/molecules/ManageFolderModal';
import { useCreateFolderMutation } from '@/redux/api/folderApi';
import {
  useCreateFormInFolderOfTeamMutation,
  useCreateFormInTeamMutation,
} from '@/redux/api/formApi';
import {
  ErrorResponse,
  FormType,
  ModalType,
  ModalTypes,
  TeamResponse,
} from '@/types';
import { cn, toastify } from '@/utils';
import { separateFields } from '@/utils/seperates';

interface OverviewTeamSidebarProps {
  team: TeamResponse;
  isLoading: boolean;
  modalType: ModalType | '';
  setModalType: (modalType: ModalType | '') => void;
}

export const OverviewTeamSidebar = ({
  team,
  isLoading,
  modalType,
  setModalType,
}: OverviewTeamSidebarProps) => {
  const [folderName, setFolderName] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('');

  const {
    activeFolder,
    activeTeam,
    setActiveFolder,
    setActiveAllForms,
    setActiveTeam,
    setSelectedRecords,
  } = useOverviewContext();
  const { setParams, params } = useFormParams();
  const { form } = useBuildFormContext();
  const [activeCollapse, setActiveCollapse] = useState<string[]>([]);
  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType('');
  const isActiveTeam = team.id === activeTeam;

  const navigate = useNavigate();

  const [createFormInTeam, { isLoading: isCreatingFormInTeam }] =
    useCreateFormInTeamMutation();
  const [
    createFormInFolderOfTeam,
    { isLoading: isCreatingFormInFolderOfTeam },
  ] = useCreateFormInFolderOfTeamMutation();
  const [createFolder, { isLoading: isFolderInTeamCreating }] =
    useCreateFolderMutation();

  const handleCreateFormInTeam = (teamId: string) => {
    const filteredForm = separateFields(form);

    return createFormInTeam({ teamId, data: filteredForm }).then((res) => {
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
        return navigate(`${PATH.BUILD_FORM_PAGE}/${res.data!.data.id}`);
      }
      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const handleCreateFormBasedOnIds = () => {
    if (activeFolder === '') {
      return handleCreateFormInTeam(activeTeam);
    }
    return handleCreateFormInFolderOfTeam(activeFolder, activeTeam);
  };

  const handleActiveCollapse = (teamId: string) => {
    setActiveCollapse((prev) => {
      if (prev.includes(teamId)) return prev.filter((prev) => prev !== teamId);
      return [...prev, teamId];
    });
  };

  const handleCreateFolderInTeam = () => {
    createFolder({ teamId: team.id, payload: { name: folderName } }).then(
      (res) => {
        if ('data' in res) {
          toastify.displaySuccess(res.data!.message as string);
          closeModal();
          return;
        }
        if (res.error as ErrorResponse)
          toastify.displayError((res.error as ErrorResponse).message as string);
      },
    );
  };

  return (
    <Box className='relative h-full w-full bg-slate-100 text-slate-600'>
      <Box className='sticky top-0 z-10 w-full border border-x-0 border-solid border-slate-300 bg-inherit px-5 py-4 text-center'>
        <Box pos='relative'>
          <LoadingOverlay
            visible={isCreatingFormInTeam || isCreatingFormInFolderOfTeam}
            zIndex={80}
            overlayProps={{ radius: 'sm', blur: 2, className: 'scale-x-150' }}
            loaderProps={{ color: 'blue' }}
          />
          <Button
            size='md'
            title='CREATE FORM'
            className='w-full font-bold'
            onClick={() => handleCreateFormBasedOnIds()}
          />
        </Box>
      </Box>
      <Box className='flex flex-col gap-5 bg-inherit p-5'>
        <Group
          key={uuidv4()}
          className={cn(
            'group cursor-pointer justify-between gap-0 rounded-md pr-2 text-slate-600 hover:bg-slate-200',
            {
              'bg-slate-300 hover:bg-slate-300': isActiveTeam,
            },
          )}
        >
          <NavLink
            key={team.id}
            className={cn(
              'w-[85%] rounded-md text-slate-600 hover:bg-slate-200',
              {
                'bg-slate-300 hover:bg-slate-300': isActiveTeam,
              },
            )}
            onClick={() => {
              setActiveAllForms(false);
              setActiveFolder('');
              setActiveTeam(team.id);
              setSelectedRecords([]);
              setParams({ ...defaultFormsParams, teamId: team.id });
            }}
            label={
              <Group className='items-center'>
                <Text className='text-sm font-semibold'>{team.name}</Text>
                {team.folders.length > 0 &&
                  (activeCollapse.includes(team.id) ? (
                    <IoIosArrowUp
                      onClick={() => {
                        handleActiveCollapse(team.id);
                      }}
                    />
                  ) : (
                    <IoIosArrowDown
                      onClick={() => {
                        handleActiveCollapse(team.id);
                      }}
                    />
                  ))}
              </Group>
            }
            active={isActiveTeam}
            leftSection={
              team.logoUrl ? (
                <img
                  className='h-[20px] w-[20px] rounded-full object-cover'
                  src={team.logoUrl}
                />
              ) : (
                <RiTeamFill size={18} />
              )
            }
          />
        </Group>
        {team.folders.length > 0 && activeCollapse.includes(team.id) && (
          <Collapse in={true}>
            <Box className='pl-3'>
              <FolderList
                folderList={team.folders}
                isLoading={isLoading}
                openModal={openModal}
                setFolderName={setFolderName}
                setFolderId={setFolderId}
                modalType={modalType}
                closeModal={closeModal}
                folderName={folderName}
                folderId={folderId}
                teamId={team.id}
              />
            </Box>
          </Collapse>
        )}
        <Divider />
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
        <Divider />
        <Box className='flex flex-col gap-2'>
          <NavLink
            className={cn(
              'rounded-md font-bold text-slate-600 hover:bg-slate-200',
              {
                'bg-slate-300 hover:bg-slate-300': params.isFavourite,
              },
            )}
            label='Favorites'
            leftSection={<FaStar className='text-orange-500' />}
            onClick={() => {
              // TODO: need to update params to get favourite forms in team
              setParams({
                ...defaultFormsParams,
                isFavourite: 1,
                formType: FormType.All,
              });
              setActiveFolder('');
              setActiveTeam('');
              setActiveAllForms(false);
              setSelectedRecords([]);
            }}
          />
          <NavLink
            className={cn(
              'rounded-md font-bold text-slate-600 hover:bg-slate-200',
              {
                'bg-slate-300 hover:bg-slate-300': params.isDeleted,
              },
            )}
            label='Trash'
            leftSection={<IoTrash className='text-gray-600' />}
            onClick={() => {
              // TODO: need to update params to get forms deleted in team
              setParams({
                ...defaultFormsParams,
                isDeleted: 1,
              });
              setActiveAllForms(false);
              setActiveFolder('');
              setActiveTeam('');
              setSelectedRecords([]);
            }}
          />
        </Box>
      </Box>
      <ManageFolderModal
        opened={modalType === ModalTypes.CREATE_FOLDER}
        onClose={closeModal}
        onClickCancel={closeModal}
        onClickSubmit={handleCreateFolderInTeam}
        setFolderName={setFolderName}
        isLoading={isFolderInTeamCreating}
      />
    </Box>
  );
};
