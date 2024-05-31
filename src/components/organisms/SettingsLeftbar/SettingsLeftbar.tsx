import { useState } from 'react';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, NavLink, Stack } from '@mantine/core';

import { useBuildFormContext } from '@/contexts';
import { cn } from '@/utils';

export const SettingsLeftbar = () => {
  const [activeSettingContent, setActiveSettingContent] =
    useState<string>('general');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isEmailsSettingPage } = useBuildFormContext();
  const handleChangeTab = (value: string) => {
    if (value === 'emails' && !isEmailsSettingPage) {
      if (pathname.includes('general')) {
        navigate(pathname.replace('general', 'emails'));
      } else {
        navigate(pathname.concat(`/${value}`));
      }
      return;
    }
    if (value === 'general' && isEmailsSettingPage) {
      navigate(pathname.replace('emails', 'general'));
    }
  };
  return (
    <Box className='absolute left-0 top-0 h-full w-[320px] bg-slate-500'>
      <Stack className='ml-3'>
        <NavLink
          className={cn(
            'rounded-l-md py-3 text-base text-white hover:bg-slate-500 hover:text-white',
            {
              'bg-white text-slate-500 hover:bg-white hover:text-slate-500':
                activeSettingContent === 'general',
            },
          )}
          label='FORM SETTINGS'
          description='Customize form status and properties'
          leftSection={
            <IoSettingsSharp
              size={25}
              className={cn('text-white', {
                'text-slate-500': activeSettingContent === 'general',
              })}
            />
          }
          classNames={{
            label: 'font-semibold text-base',
            description: cn('text-white', {
              'text-slate-500': activeSettingContent === 'general',
            }),
          }}
          active={activeSettingContent === 'general'}
          onClick={() => {
            setActiveSettingContent('general');
            handleChangeTab('general');
          }}
        />
        <NavLink
          className={cn(
            'rounded-l-md py-3 text-base text-white hover:bg-slate-500 hover:text-white',
            {
              'bg-white text-slate-500 hover:bg-white hover:text-slate-500':
                activeSettingContent === 'emails',
            },
          )}
          label='EMAIL'
          description='Send notification'
          leftSection={
            <MdEmail
              size={25}
              className={cn('text-white', {
                'text-slate-500': activeSettingContent === 'emails',
              })}
            />
          }
          classNames={{
            label: 'font-semibold text-base',
            description: cn('text-white', {
              'text-slate-500': activeSettingContent === 'emails',
            }),
          }}
          active={activeSettingContent === 'emails'}
          onClick={() => {
            setActiveSettingContent('emails');
            handleChangeTab('emails');
          }}
        />
      </Stack>
    </Box>
  );
};
