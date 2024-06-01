import { Outlet, useParams } from 'react-router-dom';
import { Box, LoadingOverlay, Stack } from '@mantine/core';

import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { Header } from '@/templates/Header';
import { ResponseTopBar } from '@/templates/ResponseTopBar';

import { NotFoundPage } from '../NotFoundPage';

export const ResponsePage = () => {
  const { id: formId } = useParams();
  const { data: formData, isLoading } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );
  if (!isLoading && formId && !formData) {
    return <NotFoundPage />;
  }
  return (
    <>
      <Header />
      <Stack className='justify-start gap-0'>
        <Box className='sticky right-0 top-0 z-[100]'>
          <ResponseTopBar />
        </Box>
        <Box pos='relative'>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'blue' }}
          />
          <Outlet />
        </Box>
      </Stack>
    </>
  );
};
