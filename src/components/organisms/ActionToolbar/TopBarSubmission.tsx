import { IoTrash } from 'react-icons/io5';
import { Text } from '@mantine/core';

import { Button } from '@/atoms/Button';
import { ResponseRow } from '@/molecules/ResponsesTable';
import {
  useDeleteMultipleResponsesMutation,
  useDeleteOneResponseMutation,
} from '@/redux/api/responseApi';
import { cn } from '@/utils';

interface TopBarSubmission {
  formId: number;
  selectedResponseIds: number[];
  setSelectedRecords: React.Dispatch<React.SetStateAction<ResponseRow[]>>;
  showingResponseRows: ResponseRow[];
}

export const TopBarSubmission = (props: TopBarSubmission) => {
  const {
    selectedResponseIds,
    setSelectedRecords,
    showingResponseRows,
    formId,
  } = props;
  const handleSelectAllOrDeselectClick = () => {
    if (showingResponseRows.length > selectedResponseIds.length) {
      setSelectedRecords(showingResponseRows);
      return;
    }
    setSelectedRecords([]);
  };

  const [deleteOneResponse, { isLoading: isLoadingDeleteOneResponse }] =
    useDeleteOneResponseMutation();
  const [
    deleteMultipleResponses,
    { isLoading: isLoadingDeleteMultipleResponse },
  ] = useDeleteMultipleResponsesMutation();

  const handleDeleteOneOrMultiple = () => {
    if (selectedResponseIds.length == 1) {
      deleteOneResponse({ formId, responseId: selectedResponseIds[0] }).then(
        () => setSelectedRecords([]),
      );
      return;
    }
    deleteMultipleResponses({ formId, responsesIds: selectedResponseIds }).then(
      () => setSelectedRecords([]),
    );
  };

  return (
    <div
      className={cn('flex w-full items-center justify-between p-4', {
        invisible: selectedResponseIds.length === 0,
      })}
    >
      <div className='flex items-center justify-between gap-3'>
        <Text className='text-[15px] text-gray-600'>
          {`Selected ${selectedResponseIds.length} ${selectedResponseIds.length === 1 ? 'record' : 'records'}`}
        </Text>
        <Button
          className='h-[36px]'
          size='md'
          onClick={handleSelectAllOrDeselectClick}
          title={
            showingResponseRows.length > selectedResponseIds.length
              ? 'Select all'
              : 'Unselect all'
          }
        />
      </div>
      <Button
        loading={isLoadingDeleteOneResponse || isLoadingDeleteMultipleResponse}
        className='h-[36px]'
        loaderProps={{ type: 'dots', color: 'red' }}
        size='md'
        variant='outline'
        color='error'
        onClick={handleDeleteOneOrMultiple}
        leftSection={<IoTrash size={18} />}
        title='Delete'
      />
    </div>
  );
};
