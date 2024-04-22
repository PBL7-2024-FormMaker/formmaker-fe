import { Box, Image, Stack } from '@mantine/core';

import ThankYou from '@/assets/images/thankyou.png';

export const SubmissionConfirmation = () => (
  <Box className='mx-auto w-[700px] rounded bg-white p-3 pb-10 shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.1)]'>
    <Stack className='items-center justify-center gap-10'>
      <Image src={ThankYou} className='mt-6 w-[155px]' />
      <Stack className='items-center justify-center gap-2'>
        <span className='text-navy-900 text-5xl font-semibold'>Thank You!</span>
        <span className='text-navy-900 text-center text-xl opacity-70'>
          Your submission has been received.
        </span>
      </Stack>
    </Stack>
  </Box>
);
