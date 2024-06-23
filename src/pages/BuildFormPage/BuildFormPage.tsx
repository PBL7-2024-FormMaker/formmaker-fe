import { Outlet, useParams } from 'react-router-dom';
import { Box, LoadingOverlay, Stack } from '@mantine/core';

import { useBuildFormContext } from '@/contexts';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { useGetMyProfileQuery } from '@/redux/api/userApi';
import { BuildFormHeader } from '@/templates/Header';
import { TopBar } from '@/templates/TopBar';
import { cn } from '@/utils';
import { canView } from '@/utils/checkPermissions';

import { LoadingPage } from '../LoadingPage';
import { NotFoundPage } from '../NotFoundPage';

export const BuildFormPage = () => {
  const { previewMode } = useBuildFormContext();
  const { id: formId } = useParams();
  const { data: formData, isLoading } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );
  const { data: myProfile, isLoading: isProfileLoading } =
    useGetMyProfileQuery();

  if (isLoading) return <LoadingPage />;

  if (!isLoading && formId && !formData) {
    return <NotFoundPage />;
  }

  if (!myProfile || !formData) return;

  if (!canView(myProfile.id, formData.permissions)) {
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
      <BuildFormHeader
        myProfile={myProfile}
        isProfileLoading={isProfileLoading}
      />
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
