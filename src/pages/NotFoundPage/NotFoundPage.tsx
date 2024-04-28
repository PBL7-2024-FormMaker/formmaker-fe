import { useNavigate } from 'react-router-dom';
import { Box, Image, Stack } from '@mantine/core';

import NotfoundImage from '@/assets/images/notfound.png';
import { Button } from '@/atoms/Button';
import { UnSignedHeader } from '@/atoms/UnsignedHeader';
import { PATH } from '@/constants';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box className='h-screen'>
      <Box className='h-headerHeight bg-navy-500 px-4 pt-4'>
        <UnSignedHeader />
      </Box>
      <Box className='h-full w-full bg-navy-10'>
        <Image
          src={NotfoundImage}
          className='relative right-[-35%] top-[5%] w-[30%]'
        />
        <Stack className='mt-[100px] items-center justify-center'>
          <span className='text-5xl text-navy-900'>Whoops!</span>
          <Button
            onClick={() => {
              navigate(PATH.OVERVIEW_PAGE);
            }}
            variant='outline'
            title='Back to home'
            size='md'
            className='w-[200px] rounded-3xl'
          />
        </Stack>
      </Box>
    </Box>
  );
};
