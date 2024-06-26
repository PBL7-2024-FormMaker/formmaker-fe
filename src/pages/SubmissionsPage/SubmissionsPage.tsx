import { useMemo, useState } from 'react';
import { BsDatabaseExclamation } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { Box } from '@mantine/core';

import { ResponseRow, ResponsesTable } from '@/molecules/ResponsesTable';
import { TopBarSubmission } from '@/organisms/ActionToolbar';
import { useGetResponsesByFormIdQuery } from '@/redux/api/responseApi';
import { ElementIdAndName, GetResponsesParams } from '@/types';
import { formatDate } from '@/utils';

export const SubmissionsPage = () => {
  const { formId } = useParams();
  const [selectedRecords, setSelectedRecords] = useState<ResponseRow[]>([]);
  const [params, setParams] = useState<GetResponsesParams>();
  const { data: response, isLoading } = useGetResponsesByFormIdQuery({
    formId: formId!,
    ...params,
  });

  const rawRecords = response?.responses;
  const elementIdAndNameList = response?.elementIdAndNameList || [];

  const result = (rawRecords || []).flatMap((response) =>
    response.formAnswers.map((answer) => ({
      elementId: answer.elementId,
      elementName: answer.elementName,
      elementType: answer.answers.map((answer) => answer.fieldName).join(', '),
    })),
  );

  const uniqueResult: { [key: string]: ElementIdAndName } = {};
  result
    .sort((firstAnswer, secondAnswer) => {
      const firstIndex = elementIdAndNameList.findIndex(
        (item) => item.elementId === firstAnswer.elementId,
      );
      const secondIndex = elementIdAndNameList.findIndex(
        (item) => item.elementId === secondAnswer.elementId,
      );
      return firstIndex - secondIndex;
    })
    .forEach((item) => {
      if (!uniqueResult[item.elementId]) {
        uniqueResult[item.elementId] = item;
      }
    });

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
              (answers) => ({
                ...answers,
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
    () => selectedRecords.map((selectedRecord) => selectedRecord.id as string),
    [selectedRecords],
  );

  if (response === undefined) return <div></div>;

  if (responseRows?.length == 0) {
    return (
      <Box className='h-screen'>
        <Box className='flex h-contentHeight w-full flex-col items-center justify-center gap-3 bg-navy-10 pt-10'>
          <BsDatabaseExclamation size={64} className='text-gray-500' />
          <span className='mb-8 text-lg text-gray-600'>No records found.</span>
        </Box>
      </Box>
    );
  }

  return (
    <div>
      <div className='bg-white'>
        <TopBarSubmission
          formId={formId!}
          selectedResponseIds={selectedResponseIds}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          showingResponseRows={responseRows || []}
        />
        <ResponsesTable
          elementIdAndNameList={Object.values(uniqueResult)}
          totalResponses={response.totalResponses}
          pageSize={response.pageSize}
          isLoading={isLoading}
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
