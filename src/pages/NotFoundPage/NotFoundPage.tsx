import { Box, Image, Stack } from '@mantine/core';

import NotfoundImage from '@/assets/images/404.png';
import { UnSignedHeader } from '@/atoms/UnsignedHeader';

export const NotFoundPage = () => (
  <Box className='h-screen'>
    <Box className='h-headerHeight bg-malachite-500 px-4 pt-4'>
      <UnSignedHeader />
    </Box>
    <Box className='h-full w-full bg-malachite-100 pt-10'>
      <Stack className='items-center justify-center'>
        <span className='text-5xl text-malachite-900'>Whoops!</span>
        <span className='text-center text-xl text-malachite-900'>
          Unfortunately, the page you were looking for could not be found. It
          may be temporarily <br /> unavailable, moved or no longer exists.
          Please check your spelling and retry.
        </span>
      </Stack>
      <Image
        src={NotfoundImage}
        className='relative bottom-[-15%] right-[-360px] w-[80vw]'
      />
    </Box>
  </Box>
);
