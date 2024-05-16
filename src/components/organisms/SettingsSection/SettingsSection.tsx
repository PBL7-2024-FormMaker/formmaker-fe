import { Box, Stack } from '@mantine/core';

import { useBuildFormContext } from '@/contexts';

import { EmailsSettingpage } from '../EmailsSettingpage';
import { FormsettingsPage } from '../FormsettingsPage';
import { SettingsLeftbar } from '../SettingsLeftbar/SettingsLeftbar';

export const SettingsSection = () => {
  const { isEmailsSettingPage } = useBuildFormContext();

  return (
    <>
      <Box className='relative flex h-mainHeight w-full items-center justify-center bg-navy-10'>
        <SettingsLeftbar />
        <Stack className='absolute right-[48%] top-[40%] w-[660px] -translate-y-[50%] translate-x-[50%]'>
          {isEmailsSettingPage && <EmailsSettingpage />}
          {!isEmailsSettingPage && <FormsettingsPage />}
        </Stack>
      </Box>
    </>
  );
};
