import { IoTrash } from 'react-icons/io5';
import { Text, Tooltip } from '@mantine/core';
import * as XLSX from 'xlsx';

import { Button } from '@/atoms/Button';
import { ResponseRow } from '@/molecules/ResponsesTable';
import {
  useDeleteMultipleResponsesMutation,
  useDeleteOneResponseMutation,
} from '@/redux/api/responseApi';
import { cn } from '@/utils';
import { transformObjects } from '@/utils/transformObj';

interface TopBarSubmission {
  formId: number;
  selectedResponseIds: number[];
  selectedRecords: ResponseRow[];
  setSelectedRecords: React.Dispatch<React.SetStateAction<ResponseRow[]>>;
  showingResponseRows: ResponseRow[];
}

const COL_INIT_WIDTH = 25;

export const TopBarSubmission = (props: TopBarSubmission) => {
  const {
    selectedResponseIds,
    selectedRecords,
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

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const transformedData =
      selectedRecords.length === 0
        ? transformObjects(showingResponseRows)
        : transformObjects(selectedRecords);
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const maxWidth = transformedData.reduce(
      (w, r) => Math.max(w, String(r.Name).length),
      COL_INIT_WIDTH,
    );
    const columns = Math.max(
      ...transformedData.map((obj) => Object.keys(obj).length),
    );
    const columnProps = Array.from({ length: columns }, () => ({
      wch: maxWidth,
    }));
    ws['!cols'] = columnProps;
    XLSX.utils.book_append_sheet(wb, ws, 'MySheet');
    XLSX.writeFile(wb, 'MyExcel.xlsx');
  };

  return (
    <div className='flex min-h-[112px] w-full items-center justify-between gap-4 p-4'>
      <div
        className={cn('flex w-[400px] items-center gap-4', {
          invisible: selectedResponseIds.length === 0,
        })}
      >
        <div className='flex items-center justify-between gap-3'>
          <Text className='min-w-[140px] text-[15px] text-gray-600'>
            {`Selected ${selectedResponseIds.length} ${selectedResponseIds.length === 1 ? 'record' : 'records'}`}
          </Text>
          <Button
            className='h-[36px] min-w-[120px]'
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
          loading={
            isLoadingDeleteOneResponse || isLoadingDeleteMultipleResponse
          }
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
      <Tooltip
        label='Export to Excel file'
        position='left'
        arrowSize={6}
        withArrow
        offset={12}
        color='grey'
      >
        <Button onClick={handleExport} title='Export' className='px-8' />
      </Tooltip>
    </div>
  );
};
