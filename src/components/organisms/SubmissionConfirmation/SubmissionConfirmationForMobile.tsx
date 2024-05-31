import { Box, Image, Stack } from '@mantine/core';

import ThankYou from '@/assets/images/thankyou.png';

export const SubmissionConfirmationForMobile = () => (
  <Box className='mx-auto w-[400px] rounded bg-white p-3 pb-10 shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.1)]'>
    <Stack className='items-center justify-center gap-10'>
      <Image src={ThankYou} className='mt-6 w-[200px]' />
      <Stack className='items-center justify-center gap-2'>
        <span className='text-5xl font-semibold text-navy-900'>Thank You!</span>
        <span className='text-center text-xl text-navy-900 opacity-70'>
          Your submission has been received.
        </span>
      </Stack>
    </Stack>
  </Box>
);
