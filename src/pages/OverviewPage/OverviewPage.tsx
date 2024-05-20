import { Box, Stack } from '@mantine/core';

import {
  BuildFormContextProvider,
  ElementLayoutProvider,
  FormParamsProvider,
  useOverviewContext,
} from '@/contexts';
import { ActionToolbar } from '@/organisms/ActionToolbar';
import { Chatbot } from '@/organisms/ChatBot';
import { FormsTable } from '@/organisms/FormsTable';
import { OverviewSidebar } from '@/organisms/OverviewSidebar';
import { Header } from '@/templates/Header';

export const OverviewPage = () => {
  const { selectedRecords } = useOverviewContext();

  return (
    <FormParamsProvider>
      <Box className='h-screen'>
        <Header />
        <Box className='flex h-full w-full items-start justify-between gap-0'>
          <Stack className='h-full w-[20%] border-y-0 border-l-0 border-r border-solid border-slate-300'>
            <BuildFormContextProvider>
              <OverviewSidebar />
            </BuildFormContextProvider>
          </Stack>
          <Stack className='h-full w-[80%] gap-0'>
            <ActionToolbar
              selectedFormIds={selectedRecords.map(({ id }) => id)}
            />
            <FormsTable />
            <BuildFormContextProvider>
              <ElementLayoutProvider>
                <Chatbot />
              </ElementLayoutProvider>
            </BuildFormContextProvider>
          </Stack>
        </Box>
      </Box>
    </FormParamsProvider>
  );
};
