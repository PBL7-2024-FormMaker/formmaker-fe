import { Box, Image, Stack } from '@mantine/core';

import NotfoundImage from '@/assets/images/404.png';
import { UnSignedHeader } from '@/atoms/UnsignedHeader';

export const NotFoundPage = () => (
  <Box className='h-screen'>
    <Box className='bg-navy-500 h-headerHeight px-4 pt-4'>
      <UnSignedHeader />
    </Box>
    <Box className='bg-navy-10 h-full w-full pt-10'>
      <Stack className='items-center justify-center'>
        <span className='text-navy-900 text-5xl'>Whoops!</span>
        <span className='text-navy-900 text-center text-xl'>
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
