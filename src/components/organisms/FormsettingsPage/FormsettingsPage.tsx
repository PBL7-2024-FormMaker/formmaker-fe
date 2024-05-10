import { IoSettingsSharp } from 'react-icons/io5';
import { Box, Group, Stack } from '@mantine/core';

export const FormsettingsPage = () => (
  <>
    <Group>
      <Box className='flex h-10 w-10 items-center justify-center rounded bg-navy-400'>
        <IoSettingsSharp size={25} className='text-white' />
      </Box>
      <Stack className='gap-0'>
        <span className='text-base font-semibold text-blue-200'>
          FORM SETTINGS
        </span>
        <span className='text-sm text-blue-100'>
          Customize form status and properties.
        </span>
      </Stack>
    </Group>
    <Stack className='mt-4 gap-8 rounded border border-solid border-blue-50 bg-white px-6 py-8'></Stack>
  </>
);
