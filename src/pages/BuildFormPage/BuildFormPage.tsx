import { Outlet, useParams } from 'react-router-dom';
import { Box, LoadingOverlay, Stack } from '@mantine/core';

import { useBuildFormContext } from '@/contexts';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { BuildFormHeader } from '@/templates/Header';
import { TopBar } from '@/templates/TopBar';
import { cn } from '@/utils';

import { NotFoundPage } from '../NotFoundPage';

export const BuildFormPage = () => {
  const { previewMode } = useBuildFormContext();
  const { id: formId } = useParams();
  const { data: formData, isLoading } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );

  if (!isLoading && formId && !formData) {
    return <NotFoundPage />;
  }

  return (
    <Box
      className={cn(
        'h-screen justify-between transition-all duration-[350ms] ease-linear',
        {
          '-translate-y-[70px]': previewMode,
        },
      )}
    >
      <BuildFormHeader />
      <Stack className='justify-start gap-0'>
        <Box className='sticky right-0 top-0 z-[100]'>
          <TopBar />
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
    </Box>
  );
};
