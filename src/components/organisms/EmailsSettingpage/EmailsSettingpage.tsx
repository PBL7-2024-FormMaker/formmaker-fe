import { useEffect, useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { Box, Divider, Group, Image, Stack, Text } from '@mantine/core';

import BlueLogo from '@/assets/images/bluelogo.png';
import { ToggleButton } from '@/atoms/Button';
import { MESSAGES, PATH } from '@/constants';
import {
  useGetFormDetailsQuery,
  useUpdateDisabledNotificationStatusMutation,
} from '@/redux/api/formApi';
import { useGetResponsesByFormIdQuery } from '@/redux/api/responseApi';
import { toastify } from '@/utils';

export const EmailsSettingpage = () => {
  const [disabledSendNotification, setDisabledSendNotification] =
    useState<boolean>(true);
  const { id: formId } = useParams();
  const formid: string = formId!;
  const { data: form } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );
  const [updateDisabledNotificationStatus] =
    useUpdateDisabledNotificationStatusMutation();
  const { data: response } = useGetResponsesByFormIdQuery({
    formId: formId!,
  });
  useEffect(() => {
    if (form) {
      setDisabledSendNotification(form.disabledNotification);
    }
  }, [form]);
  return (
    <>
      <Group>
        <Box className='flex h-10 w-10 items-center justify-center rounded bg-navy-400'>
          <MdEmail size={20} className='text-white' />
        </Box>
        <Stack className='gap-0'>
          <span className='text-base font-semibold text-blue-200'>
            EMAIL NOTIFICATION
          </span>
          <span className='text-sm text-blue-100'>
            Auto send email notification when someone answer your form.
          </span>
        </Stack>
      </Group>
      <Stack className='mt-4 gap-8 rounded border border-solid border-blue-50 bg-white px-6 py-8'>
        <Group className='items-center justify-between gap-2'>
          <Stack className='gap-[3px]'>
            <span className='text-base font-semibold uppercase text-blue-200'>
              FORM NOTIFICATION STATUS
            </span>
            <span className='text-sm text-gray-500'>
              {`You is currently ${disabledSendNotification ? 'unable' : 'able'} to receive notification`}
            </span>
          </Stack>
          <ToggleButton
            label={disabledSendNotification ? 'DISABLED' : 'ENABLED'}
            labelClassName={
              disabledSendNotification
                ? 'text-gray-500 text-xs'
                : 'text-navy-500 text-xs'
            }
            className='text-sm text-gray-700'
            isEnable={!disabledSendNotification}
            handleToggleButton={() => {
              if (!form?.id) return;
              updateDisabledNotificationStatus({
                formId: form.id,
                disabledNotification: !disabledSendNotification,
              }).catch(() => {
                toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
                return;
              });
              setDisabledSendNotification(!disabledSendNotification);
            }}
          />
        </Group>
        <Stack className='gap-2'>
          <Group className='gap-1'>
            <Text className='font-bold'>Email subject</Text>
            <Text className='text-lg text-red-500'>*</Text>
          </Group>
          <Text className='border border-solid border-slate-400 py-2 pl-3'>
            Re: You have a response for {form?.title}
          </Text>
          <Group className='gap-1'>
            <Text className='font-bold'>Email content</Text>
            <Text className='text-lg text-red-500'>*</Text>
          </Group>
          <Stack className='max-h-[250px] gap-2 overflow-y-auto border border-solid border-slate-400 p-3'>
            <div className='flex h-[100px] flex-row justify-center'>
              <Image src={BlueLogo} h={60} className='pb-2' />
            </div>
            <Divider />
            <Text className='text-xl font-bold'>{form?.title}</Text>
            <Divider />
            {response?.elementIdAndNameList.map((elementIdAndName) => (
              <Group>
                <div className='flex w-[250px]'>
                  <Text
                    className='text-slate-400'
                    key={elementIdAndName.elementId}
                  >
                    {elementIdAndName.elementName}:
                  </Text>
                </div>
                <Text>[answer]</Text>
              </Group>
            ))}
            <Divider />
            <div className='flex flex-row items-center justify-center'>
              <Text className='text-sm'>You can see all your responses at</Text>
              <Link
                to={PATH.RESPONSE_PAGE.replace(':formId', formid)}
                className='ml-1 w-[50px] text-sm text-navy-500 no-underline hover:font-medium hover:text-navy-800'
              >
                Here
              </Link>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
