import { useEffect, useState } from 'react';
import { FaLink } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import {
  Box,
  CopyButton,
  Divider,
  Group,
  Stack,
  TextInput,
} from '@mantine/core';

import { Button, ToggleButton } from '@/atoms/Button';
import { MESSAGES } from '@/constants';
import { useBuildFormContext } from '@/contexts';
import {
  useGetFormDetailsQuery,
  useUpdateDisabledStatusMutation,
} from '@/redux/api/formApi';
import { toastify } from '@/utils';

export const PublishSection = () => {
  const { id: formId } = useParams();

  const { data: form } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );
  const [updateDisabledStatus] = useUpdateDisabledStatusMutation();

  const { isEditForm } = useBuildFormContext();

  const [disabledForm, setDisabledForm] = useState<boolean>(false);

  const link = isEditForm ? `${window.location.origin}/form/${form?.id}` : '';

  useEffect(() => {
    if (form) {
      setDisabledForm(form.disabled);
    }
  }, [form]);

  return (
    <Box className='relative flex h-screen w-full items-center justify-center bg-malachite-50'>
      <Stack className='absolute top-[50%] w-[660px] -translate-y-[50%]'>
        <Group>
          <Box className='flex h-10 w-10 items-center justify-center rounded bg-malachite-400'>
            <FaLink size={20} className='text-white' />
          </Box>
          <Stack className='gap-0'>
            <span className='text-base font-semibold text-blue-200'>
              DIRECT LINK OF YOUR FORM
            </span>
            <span className='text-sm text-blue-100'>
              Your form is securely published and ready to use at this address.
            </span>
          </Stack>
        </Group>
        <Stack className='mt-4 gap-8 rounded border border-solid border-blue-50 bg-white px-6 py-8'>
          <span className='text-base font-semibold text-blue-200'>
            SHARE WITH LINK
          </span>
          <TextInput
            leftSection={<FiLink size={16} />}
            value={link}
            variant='filled'
            readOnly
            classNames={{
              input: 'h-10 focus:border-none',
            }}
            onClick={(e) => e.currentTarget.select()}
          />
          <Group className='justify-end'>
            <CopyButton value={link}>
              {({ copied, copy }) => (
                <Button
                  onClick={copy}
                  title={copied ? 'Copied to clipboard!' : 'COPY LINK'}
                  disabled={!isEditForm}
                />
              )}
            </CopyButton>
            <Button
              className='bg-blueButton hover:bg-blueButton'
              title='OPEN IN NEW TAB'
              onClick={() => {
                window.open(link, '_blank');
              }}
              disabled={!isEditForm}
            />
          </Group>
          <Divider className='bg-slate-300' />
          <Group className='items-center justify-between gap-2'>
            <Stack className='gap-[3px]'>
              <span className='text-base font-semibold uppercase text-blue-200'>
                FORM STATUS
              </span>
              <span className='text-sm text-gray-500'>
                {`Your form is currently ${disabledForm ? 'unable' : 'able'} to receive submissions`}
              </span>
            </Stack>
            <ToggleButton
              label={disabledForm ? 'DISABLED' : 'ENABLED'}
              labelClassName={
                disabledForm
                  ? 'text-gray-500 text-xs'
                  : 'text-malachite-500 text-xs'
              }
              className='text-sm text-gray-700'
              isEnable={!disabledForm}
              handleToggleButton={() => {
                if (!form?.id) return;
                updateDisabledStatus({
                  formId: form.id,
                  disabled: !disabledForm,
                }).catch(() => {
                  toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
                  return;
                });
                setDisabledForm(!disabledForm);
              }}
            />
          </Group>
        </Stack>
      </Stack>
    </Box>
  );
};
