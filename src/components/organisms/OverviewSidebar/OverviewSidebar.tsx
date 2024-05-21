import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoTrash } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, LoadingOverlay, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Button } from '@/atoms/Button';
import { defaultFormsParams } from '@/constants/defaultFormsParams';
import { PATH } from '@/constants/routes';
import {
  useBuildFormContext,
  useFormParams,
  useOverviewContext,
} from '@/contexts';
import { FolderGroup } from '@/molecules/FolderGroup';
import { TeamGroup } from '@/molecules/TeamGroup';
import { useGetMyFoldersQuery } from '@/redux/api/folderApi';
import {
  useCreateFormInFolderMutation,
  useCreateFormInFolderOfTeamMutation,
  useCreateFormInTeamMutation,
  useCreateFormMutation,
} from '@/redux/api/formApi';
import { ErrorResponse, FormType } from '@/types';
import { cn, toastify } from '@/utils';
import { separateFields } from '@/utils/seperates';

import { CreateFormModal } from '../../molecules/CreateFormModal/CreateFormModal';

export const OverviewSidebar = () => {
  const [folderName, setFolderName] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('');
  const [
    openedModalCreateForm,
    { open: openModalCreateForm, close: closeModalCreateForm },
  ] = useDisclosure(false);
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

  const navigate = useNavigate();

  const { data: folderList, isLoading: isFolderLoading } =
    useGetMyFoldersQuery();
  const [createForm, { isLoading: isCreatingForm }] = useCreateFormMutation();
  const [createFormInFolder, { isLoading: isCreatingFormInFolder }] =
    useCreateFormInFolderMutation();
  const [createFormInTeam, { isLoading: isCreatingFormInTeam }] =
    useCreateFormInTeamMutation();
  const [
    createFormInFolderOfTeam,
    { isLoading: isCreatingFormInFolderOfTeam },
  ] = useCreateFormInFolderOfTeamMutation();

  const folderListNotInTeam = folderList?.filter((folder) => !folder.teamId);

  const handleCreateForm = () => {
    const filteredForm = separateFields(form);
    return createForm(filteredForm).then((res) => {
      if ('data' in res) {
        return navigate(`${PATH.BUILD_FORM_PAGE}/${res.data!.data.id}`);
      }
      return toastify.displayError((res.error as ErrorResponse).message);
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
    if (activeFolder === '' && activeTeam === '') {
      return handleCreateForm();
    }
    if (activeTeam === '') {
      return handleCreateFormInFolder(activeFolder);
    }
    if (activeFolder === '') {
      return handleCreateFormInTeam(activeTeam);
    }
    return handleCreateFormInFolderOfTeam(activeFolder, activeTeam);
  };

  return (
    <Box className='relative h-full w-full bg-slate-100 text-slate-600'>
      <Box className='sticky top-0 z-10 w-full border border-x-0 border-solid border-slate-300 bg-inherit px-5 py-4 text-center'>
        <Box pos='relative'>
          <LoadingOverlay
            visible={
              isCreatingForm ||
              isCreatingFormInFolder ||
              isCreatingFormInTeam ||
              isCreatingFormInFolderOfTeam
            }
            zIndex={80}
            overlayProps={{ radius: 'sm', blur: 2, className: 'scale-x-150' }}
            loaderProps={{ color: 'blue', size: 'sm' }}
          />
          <Button
            size='md'
            title='CREATE FORM'
            className='w-full font-bold'
            onClick={openModalCreateForm}
          />
          <NavLink />
        </Box>
      </Box>
      <Box className='flex flex-col gap-5 bg-inherit p-5'>
        <FolderGroup
          folderList={folderListNotInTeam}
          isLoading={isFolderLoading}
          folderName={folderName}
          setFolderName={setFolderName}
          folderId={folderId}
          setFolderId={setFolderId}
        />
        <Divider />
        <TeamGroup
          setFolderName={setFolderName}
          setFolderId={setFolderId}
          folderName={folderName}
          folderId={folderId}
        />
        <Divider />
        <NavLink
          className={cn(
            'rounded-md font-semibold text-slate-600 hover:bg-slate-200',
            {
              'bg-slate-300 hover:bg-slate-300':
                params.formType === FormType.Shared,
            },
          )}
          label='Shared with me'
          onClick={() => {
            // setIsSharedForms(true);
            setParams({
              ...defaultFormsParams,
              formType: FormType.Shared,
            });
            setActiveFolder('');
            setActiveTeam('');
            setActiveAllForms(false);
            setSelectedRecords([]);
          }}
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
      <CreateFormModal
        opened={openedModalCreateForm}
        onClose={closeModalCreateForm}
        onClickCreateScratch={handleCreateFormBasedOnIds}
      />
    </Box>
  );
};
