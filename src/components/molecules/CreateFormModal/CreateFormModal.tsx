import { BiImport } from 'react-icons/bi';
import { FiPlus } from 'react-icons/fi';
import {
  ActionIcon,
  Group,
  ModalProps as MantineModalProps,
  Stack,
  Text,
} from '@mantine/core';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { ImportFormPage } from '../../../pages/ImportFormpage';

interface CreateFormModalProps extends MantineModalProps {
  onClickCreateScratch: () => void;
}
export const CreateFormModal = ({
  onClickCreateScratch,
  ...props
}: CreateFormModalProps) => {
  const [openedImportForm, { open: openImportForm, close: closeImportForm }] =
    useDisclosure(false);
  return (
    <>
      <Modal
        classNames={{ title: 'w-full text-center' }}
        centered
        {...props}
        size='xl'
        title={
          <>
            <Stack className='gap-0'>
              <Text className='text-2xl font-bold'>Create a Form</Text>
              <Text className='text-sm text-navy-300'>
                Create or import a form to start gathering data
              </Text>
            </Stack>
          </>
        }
      >
        <Group className='h-[250px] justify-center gap-[100px]'>
          <Stack className='items-center'>
            <ActionIcon
              variant='filled'
              aria-label='scratch'
              className='h-[150px] w-[150px] bg-navy-100'
              onClick={onClickCreateScratch}
            >
              <FiPlus style={{ width: '40%', height: '70%' }} />
            </ActionIcon>
            <Text className='font-medium'>Start from scratch</Text>
            <Text className='text-sm'>A blank slate is all you need</Text>
          </Stack>
          <Stack className='items-center'>
            <ActionIcon
              variant='filled'
              aria-label='Settings'
              className='h-[150px] w-[150px] bg-navy-100'
              onClick={openImportForm}
            >
              <BiImport style={{ width: '40%', height: '70%' }} />
            </ActionIcon>
            <Text className='font-medium'>Import form</Text>
            <Text className='text-sm'>Convert an existing form in seconds</Text>
          </Stack>
        </Group>
      </Modal>
      <Modal
        opened={openedImportForm}
        onClose={closeImportForm}
        centered
        size='xl'
      >
        <ImportFormPage />
      </Modal>
    </>
  );
};
