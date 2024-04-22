import { useEffect, useMemo, useState } from 'react';
import { BsFileText } from 'react-icons/bs';
import { FaFolder, FaStar } from 'react-icons/fa';
import { FaPlayCircle } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { IoEye, IoTrash } from 'react-icons/io5';
import { MdDriveFileMoveRtl } from 'react-icons/md';
import { PiPauseCircleFill } from 'react-icons/pi';
import { RiFolderAddFill, RiTeamFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Badge,
  Box,
  CloseButton,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';

import { Button } from '@/atoms/Button';
import { MESSAGES } from '@/constants';
import {
  DEFAULT_PAGE_SIZE,
  defaultFormsParams,
} from '@/constants/defaultFormsParams';
import { PATH } from '@/constants/routes';
import { useFormParams, useOverviewContext } from '@/contexts';
import { AddToFolderModal } from '@/molecules/AddToFolderModal';
import { ConfirmationModal } from '@/molecules/ComfirmationModal';
import { MoveToTeamModal } from '@/molecules/MoveToTeamModal';
import {
  useAddToFavouritesMutation,
  useDeleteFormMutation,
  useGetMyFormsQuery,
  useRemoveFromFolderMutation,
  useRemoveFromTeamMutation,
  useRestoreFormMutation,
  useUpdateDisabledStatusMutation,
} from '@/redux/api/formApi';
import { ErrorResponse, FormResponse, ModalType, ModalTypes } from '@/types';
import { formatDate, toastify } from '@/utils';

export const FormsTable = () => {
  const { activeTeam, selectedRecords, setSelectedRecords } =
    useOverviewContext();

  const [modalType, setModalType] = useState<ModalType | ''>('');
  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType('');

  const { params, setParams, currentPage, setCurrentPage } = useFormParams();

  const navigate = useNavigate();

  const {
    data,
    isFetching: isFormFetching,
    refetch,
  } = useGetMyFormsQuery(params);

  const [addToFavouritesMutation, { isLoading: isAddingToFavourites }] =
    useAddToFavouritesMutation();

  const [deleteForm, { isLoading: isDeletingForm }] = useDeleteFormMutation();

  const [restoreForm, { isLoading: isRestoringForm }] =
    useRestoreFormMutation();

  const [removeFromFolder, { isLoading: isRemovingFromFolder }] =
    useRemoveFromFolderMutation();

  const [removeFromTeam, { isLoading: isRemovingFromTeam }] =
    useRemoveFromTeamMutation();

  const [updateDisabledStatus, { isLoading: isUpdatingFormStatus }] =
    useUpdateDisabledStatusMutation();

  const handleDeleteForm = (record: FormResponse) => {
    deleteForm({ id: record.id }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data.message);
        closeModal();
        setSelectedRecords([]);
        return;
      }
      if (res.error as ErrorResponse) {
        toastify.displayError((res.error as ErrorResponse).message);
        closeModal();
        setSelectedRecords([]);
      }
    });
  };

  const handleRestoreForm = (record: FormResponse) => {
    setSelectedRecords([record]);
    restoreForm({ id: record.id }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data.message);
        setSelectedRecords([]);
        return;
      }
      if (res.error as ErrorResponse) {
        toastify.displayError((res.error as ErrorResponse).message);
        setSelectedRecords([]);
      }
    });
  };

  const handleRemoveFromFolder = (record: FormResponse) => {
    removeFromFolder({ formId: record.id, folderId: record.folderId }).then(
      (res) => {
        if ('data' in res) {
          toastify.displaySuccess(res.data.message);
          setSelectedRecords([]);
          return;
        }
        if (res.error as ErrorResponse) {
          toastify.displayError((res.error as ErrorResponse).message);
          setSelectedRecords([]);
        }
      },
    );
  };

  const handleRemoveFromTeam = (record: FormResponse) => {
    removeFromTeam({ formId: record.id, teamId: record.teamId }).then((res) => {
      if ('data' in res) {
        toastify.displaySuccess(res.data.message);
        closeModal();
        setSelectedRecords([]);
        return;
      }
      if (res.error as ErrorResponse) {
        toastify.displayError((res.error as ErrorResponse).message);
        closeModal();
        setSelectedRecords([]);
      }
    });
  };

  const handleUpdateFormStatus = (
    record: FormResponse,
    action: 'enable' | 'disable',
  ) => {
    updateDisabledStatus({
      formId: record.id,
      disabled: action === 'disable',
    })
      .then(() => {
        toastify.displaySuccess(
          action === 'enable'
            ? MESSAGES.ENABLE_FORM_SUCCESS
            : MESSAGES.DISABLE_FORM_SUCCESS,
        );
        setSelectedRecords([]);
        return;
      })
      .catch(() => {
        toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
        setSelectedRecords([]);
        return;
      });
  };

  const isFetching =
    isFormFetching ||
    isAddingToFavourites ||
    isDeletingForm ||
    isRestoringForm ||
    isRemovingFromFolder ||
    isRemovingFromTeam ||
    isUpdatingFormStatus;

  const moreOptions = useMemo(
    () => [
      {
        text: 'View',
        icon: <IoEye size={18} />,
        handleClick: (record: FormResponse) => {
          navigate(`/form/${record.id}`);
        },
      },
      {
        text: 'Add to Folder',
        icon: <RiFolderAddFill size={18} />,
        handleClick: (record: FormResponse) => {
          setSelectedRecords([record]);
          openModal(ModalTypes.ADD_TO_FOLDER);
        },
      },
      {
        text: activeTeam === -1 ? 'Move to Team' : 'Move to My Forms',
        icon: <RiTeamFill size={18} />,
        handleClick: (record: FormResponse) => {
          setSelectedRecords([record]);
          if (activeTeam === -1) {
            openModal(ModalTypes.MOVE_TO_TEAM);
            return;
          }
          openModal(ModalTypes.REMOVE_FROM_TEAM);
        },
      },
      {
        text: 'Disable',
        icon: <PiPauseCircleFill size={18} />,
        handleClick: (record: FormResponse) =>
          handleUpdateFormStatus(record, 'disable'),
      },
      {
        text: 'Enable',
        icon: <FaPlayCircle size={18} />,
        handleClick: (record: FormResponse) =>
          handleUpdateFormStatus(record, 'enable'),
      },
      {
        text: 'Delete',
        icon: <IoTrash size={18} />,
        handleClick: (record: FormResponse) => handleDeleteForm(record),
      },
    ],
    [activeTeam],
  );

  const columns: DataTableColumn<FormResponse>[] = useMemo(
    () => [
      {
        accessor: 'isFavourite',
        render: (record: FormResponse) => (
          <ActionIcon
            variant='transparent'
            className={
              record.isFavourite
                ? 'text-yellow-500 hover:text-yellow-500'
                : 'text-gray-300 hover:text-gray-300'
            }
            aria-label='Favourites'
            onClick={(e) => {
              e.stopPropagation();
              addToFavouritesMutation({ id: record.id });
            }}
          >
            <FaStar size={20} />
          </ActionIcon>
        ),
      },
      {
        accessor: 'title',
        render: (record: FormResponse) => (
          <Group>
            <Tooltip
              color='gray'
              arrowOffset={20}
              arrowSize={5}
              label='This form is currently disabled'
              withArrow
              position='top-start'
              className='text-xs text-white'
              disabled={!record.disabled}
            >
              <UnstyledButton>
                <BsFileText
                  size={36}
                  className={
                    record.disabled ? 'text-gray-400' : 'text-malachite-500'
                  }
                />
              </UnstyledButton>
            </Tooltip>
            <Stack className='gap-2'>
              <Group>
                <Text className='text-lg font-semibold text-gray-900'>
                  {record.title}
                </Text>
                {record.folder && (
                  <Box className='group flex h-6 items-center justify-center gap-1 rounded-full bg-yellow-500 px-2 py-0.5'>
                    <Badge
                      className='m-0 bg-inherit p-0 text-xs normal-case text-black'
                      leftSection={<FaFolder />}
                    >
                      {record.folder.name}
                    </Badge>
                    <CloseButton
                      variant='transparent'
                      size={18}
                      className='hidden text-black group-hover:flex'
                      onClick={() => handleRemoveFromFolder(record)}
                    />
                  </Box>
                )}
              </Group>
              <Group className='items-center gap-1'>
                <UnstyledButton
                  onClick={() => {
                    navigate(
                      PATH.RESPONSE_PAGE.replace(
                        ':formId',
                        record.id.toString(),
                      ),
                    );
                  }}
                  className='text-sm font-medium text-gray-500 hover:text-malachite-500 hover:underline'
                >
                  {record.totalSubmissions} submissions.
                </UnstyledButton>
                <Text className='text-sm font-medium text-gray-500'>
                  Created on {formatDate(record.createdAt, 'MMM D, YYYY')}
                </Text>
              </Group>
            </Stack>
          </Group>
        ),
      },
      {
        accessor: 'edit',
        render: (record: FormResponse) =>
          record.deletedAt === null ? (
            <Button
              title='Edit Form'
              variant='subtle'
              classNames={{
                inner: 'w-20',
                root: 'flex justify-center items-center',
              }}
              className='h-full w-full font-medium focus:font-bold'
              onClick={() => {
                navigate(`${PATH.BUILD_FORM_PAGE}/${record.id}`);
              }}
            />
          ) : (
            <Button
              title='Purge'
              variant='subtle'
              classNames={{
                inner: 'w-20',
                root: 'flex justify-center items-center',
              }}
              className='h-full w-full font-medium focus:font-bold'
              onClick={() => {
                setSelectedRecords([record]);
                openModal(ModalTypes.DELETE_FORM_PERMANENTLY);
              }}
            />
          ),
        cellsClassName: 'cursor-pointer hover:bg-malachite-100 w-30 h-20 p-0',
      },
      {
        accessor: 'more',
        render: (record: FormResponse) =>
          record.deletedAt === null ? (
            <Menu shadow='sm' offset={10} position='bottom' withArrow>
              <Menu.Target>
                <Button
                  onClick={() => {
                    setSelectedRecords([record]);
                  }}
                  title='More'
                  variant='subtle'
                  rightSection={<IoIosArrowDown />}
                  classNames={{
                    inner: 'w-20',
                    root: 'flex justify-center items-center',
                  }}
                  className='h-full w-full font-medium aria-expanded:font-bold'
                />
              </Menu.Target>

              <Menu.Dropdown className='min-w-[200px] !bg-malachite-100'>
                {record.disabled
                  ? moreOptions
                      .filter((option) => option.text !== 'Disable')
                      .map((option, index) => (
                        <Menu.Item
                          key={index}
                          leftSection={option.icon}
                          className='mb-1 mt-0.5 gap-4 px-4 py-2 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-malachite-400 hover:text-white'
                          onClick={() => option.handleClick(record)}
                        >
                          {option.text}
                        </Menu.Item>
                      ))
                  : moreOptions
                      .filter((option) => option.text !== 'Enable')
                      .map((option, index) => (
                        <Menu.Item
                          key={index}
                          leftSection={option.icon}
                          className='mb-1 mt-0.5 gap-4 px-4 py-2 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-malachite-400 hover:text-white'
                          onClick={() => option.handleClick(record)}
                        >
                          {option.text}
                        </Menu.Item>
                      ))}
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              title='Restore'
              variant='subtle'
              classNames={{
                inner: 'w-20',
                root: 'flex justify-center items-center',
              }}
              className='h-full w-full font-medium focus:font-bold'
              onClick={() => handleRestoreForm(record)}
            />
          ),
        cellsClassName: 'cursor-pointer hover:bg-malachite-100 w-30 h-20 p-0',
      },
    ],
    [moreOptions],
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    setParams({
      ...defaultFormsParams,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DataTable
        noHeader
        withRowBorders={false}
        highlightOnHover
        rowClassName='cursor-pointer'
        columns={columns}
        records={data?.forms}
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
        onRowClick={({ record: clickedRecord }) => {
          setSelectedRecords((prev) => {
            const isSelectedRecord =
              prev.findIndex((record) => record.id === clickedRecord.id) !== -1;
            if (isSelectedRecord) {
              return [...prev];
            }
            return [...prev, clickedRecord];
          });
        }}
        noRecordsText='No records found'
        totalRecords={data?.totalForms}
        recordsPerPage={data?.pageSize ?? DEFAULT_PAGE_SIZE}
        page={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          setParams((prevState) => ({
            ...prevState,
            page,
          }));
        }}
        paginationSize='sm'
        paginationText={({ from, to, totalRecords }) =>
          `Showing ${from} - ${to} of ${totalRecords}`
        }
        paginationActiveBackgroundColor='green'
        fetching={isFetching}
        loaderType='oval'
        loaderSize='md'
        loaderColor='green'
        scrollAreaProps={{
          type: 'scroll',
        }}
        classNames={{
          table: 'pl-3 mb-[50px]',
          pagination:
            'fixed w-[80%] h-[50px] bottom-0 z-40 border-t-0 shadow-[0_-4px_10px_-6px_rgba(0,0,0,0.2)]',
        }}
      />
      <AddToFolderModal
        opened={modalType === ModalTypes.ADD_TO_FOLDER}
        onClose={closeModal}
        closeModal={closeModal}
        selectedFormIds={selectedRecords.map(({ id }) => id)}
      />
      <MoveToTeamModal
        opened={modalType === ModalTypes.MOVE_TO_TEAM}
        onClose={closeModal}
        closeModal={closeModal}
        selectedFormIds={selectedRecords.map(({ id }) => id)}
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
              This form and all of its submissions will be deleted permanently.
              This operation cannot be undone.
            </Text>
          </Box>
        }
        opened={modalType === ModalTypes.DELETE_FORM_PERMANENTLY}
        onClose={closeModal}
        onClickBack={closeModal}
        onClickConfirm={() => handleDeleteForm(selectedRecords[0])}
        isLoading={isDeletingForm}
      />
      <ConfirmationModal
        size='lg'
        body={
          <Box className='flex flex-col items-center gap-3 px-10 py-5'>
            <MdDriveFileMoveRtl size={70} className='text-malachite-500' />
            <Text size='lg' className='font-bold'>
              Move to My Forms
            </Text>
            <Text className='text-center'>
              The team members will no longer access this form.
            </Text>
          </Box>
        }
        opened={modalType === ModalTypes.REMOVE_FROM_TEAM}
        onClose={closeModal}
        onClickBack={closeModal}
        onClickConfirm={() => handleRemoveFromTeam(selectedRecords[0])}
        confirmButtonProps={{
          title: 'Move Now',
          className: 'bg-malachite-500 hover:bg-malachite-600',
        }}
        isLoading={isRemovingFromTeam}
      />
    </>
  );
};
