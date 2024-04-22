import { ReactNode } from 'react';
import { CloseButton, Divider, Flex, Text } from '@mantine/core';
import _startCase from 'lodash.startcase';

import { Button } from '@/atoms/Button';

interface UserInfoItemProps {
  editingFieldName: string;
  fieldName: string;
  content: ReactNode;
  handleEdit: (fieldName: string) => void;
  handleCancelEdit: () => void;
  hasEditButton: boolean;
  isLastItem: boolean;
}

export const UserInfoItem = ({
  editingFieldName,
  fieldName,
  content,
  handleEdit,
  handleCancelEdit,
  hasEditButton,
  isLastItem,
}: UserInfoItemProps) => (
  <>
    <Flex align='start' justify='space-between' gap='xl'>
      <Text className='font-bold' flex={1.5}>
        {_startCase(fieldName)}
      </Text>
      <Flex
        align={editingFieldName === fieldName ? 'start' : 'center'}
        justify='space-between'
        flex={5}
      >
        {content}
        {hasEditButton &&
          (editingFieldName === fieldName ? (
            <CloseButton
              className='text-malachite-700 [&>svg]:!h-4 [&>svg]:!w-4'
              onClick={handleCancelEdit}
            />
          ) : (
            <Button
              title='Edit'
              variant='subtle'
              onClick={() => handleEdit(fieldName)}
            />
          ))}
      </Flex>
    </Flex>
    {!isLastItem && <Divider className='my-3' />}
  </>
);
