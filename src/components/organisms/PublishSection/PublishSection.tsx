import { FaLink } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button as MantineButton,
  CopyButton,
  Group,
  Stack,
  TextInput,
} from '@mantine/core';

import { Button } from '@/atoms/Button';
import { useBuildFormContext } from '@/contexts';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';

export const PublishSection = () => {
  const { id: formId } = useParams();

  const { data: form } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );

  const { isEditForm } = useBuildFormContext();

  const link = isEditForm ? `${window.location.origin}/form/${form?.id}` : '';

  return (
    <Box className='relative flex h-mainHeight w-full items-center justify-center bg-navy-10'>
      <Stack className='absolute right-[48%] top-[40%] w-[660px] -translate-y-[50%] translate-x-[50%]'>
        <Group>
          <Box className='flex h-10 w-10 items-center justify-center rounded bg-navy-400'>
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
                <MantineButton
                  color='orange'
                  onClick={copy}
                  disabled={!isEditForm}
                >
                  {copied ? 'Copied to clipboard!' : 'COPY LINK'}
                </MantineButton>
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
        </Stack>
      </Stack>
    </Box>
  );
};
