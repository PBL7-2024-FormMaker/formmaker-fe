import { useMemo, useState } from 'react';
import { BsDatabaseExclamation } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { Box } from '@mantine/core';

import { ResponseRow, ResponsesTable } from '@/molecules/ResponsesTable';
import { TopBarSubmission } from '@/organisms/ActionToolbar';
import { useGetResponsesByFormIdQuery } from '@/redux/api/responseApi';
import { Header } from '@/templates/Header';
import { GetResponsesParams } from '@/types';
import { formatDate } from '@/utils';

export const ResponsesPage = () => {
  const { formId } = useParams();
  const [selectedRecords, setSelectedRecords] = useState<ResponseRow[]>([]);
  const [params, setParams] = useState<GetResponsesParams>();
  const { data: response, isFetching } = useGetResponsesByFormIdQuery({
    formId: Number(formId),
    ...params,
  });

  const rawRecords = response?.responses;

  const responseRows: ResponseRow[] | undefined = useMemo(
    () =>
      rawRecords?.map((record) => {
        const answers = record.formAnswers.reduce(
          (elementAnswersList, elementAnswers) => {
            const elementAnswer = {
              [`NameElement${elementAnswers.elementId}`]:
                elementAnswers.elementName,
              [`ValueElement${elementAnswers.elementId}`]:
                elementAnswers.answers
                  .map((fieldAnswer) => fieldAnswer.text)
                  .join(' '),
            };

            const fieldsAnswers = elementAnswers.answers.reduce(
              (answers, currentFieldAnswer) => ({
                ...answers,
                [`NameField${elementAnswers.elementId}`]:
                  currentFieldAnswer.fieldName,
                [`ValueField${elementAnswers.elementId}`]:
                  currentFieldAnswer.text,
              }),
              { ...elementAnswer },
            );
            return { ...elementAnswersList, ...fieldsAnswers };
          },
          {
            id: record.id,
            createdAt: formatDate(record.createdAt, 'MMM D, YYYY HH:mm:ss A'),
          },
        );

        return {
          ...answers,
        };
      }),
    [rawRecords],
  );
  const selectedResponseIds = useMemo(
    () => selectedRecords.map((selectedRecord) => selectedRecord.id as number),
    [selectedRecords],
  );

  if (response === undefined) return <div></div>;

  if (responseRows?.length == 0) {
    return (
      <Box className='h-screen'>
        <Header />
        <Box className='flex h-contentHeight w-full flex-col items-center justify-center gap-3 bg-malachite-100 pt-10'>
          <BsDatabaseExclamation size={64} className='text-gray-500' />
          <span className='mb-8 text-lg text-gray-600'>No records found.</span>
        </Box>
      </Box>
    );
  }

  return (
    <div>
      <div className='bg-white'>
        <Header />
        <TopBarSubmission
          formId={Number(formId)}
          selectedResponseIds={selectedResponseIds}
          setSelectedRecords={setSelectedRecords}
          showingResponseRows={responseRows || []}
        />
        <ResponsesTable
          elementIdAndNameList={response.elementIdAndNameList}
          totalResponses={response.totalResponses}
          pageSize={response.pageSize}
          isLoading={isFetching}
          responseRows={responseRows || []}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          params={params}
          setParams={setParams}
        />
      </div>
    </div>
  );
};
