import { useMemo, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import {
  ActionIcon,
  Box,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';

import { ElementGroupType, ElementList } from '@/configs';
import { useBuildFormContext, useElementLayouts } from '@/contexts';
import { ElementItem, ElementType } from '@/types';
import { cn } from '@/utils';
import { createItem, getDefaultWidthHeight } from '@/utils/elements';

import { ItemElement } from '../ItemElement';

const elementList = ElementList as ElementGroupType[];
interface BuildFormLeftbarProps {
  setCurrentElementType: (element: ElementType) => void;
}

const ELEMENT_ICON_SIZE = 25;

export const BuildFormLeftbar = ({
  setCurrentElementType,
}: BuildFormLeftbarProps) => {
  const { elements, setElements, setIsScrollToBottom } = useElementLayouts();
  const { form } = useBuildFormContext();
  const [searchValue, setSearchValue] = useState('');
  const hasSubmitButton = elements.some(
    (element) => element.type === ElementType.SUBMIT,
  );
  const handleDrop = (elementType: ElementType) => {
    setCurrentElementType(elementType);
  };
  const handleOnChangeSearchValue = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchValue(e.target.value);
  };

  const filteredElements = useMemo(
    () =>
      elementList
        .filter(
          (elements) =>
            elements.elements.findIndex((element) =>
              element.element.type
                .toLowerCase()
                .includes(searchValue.toLowerCase()),
            ) !== -1,
        )
        .map((elements: ElementGroupType) => ({
          title: elements.title,
          elements: elements.elements.filter((element) =>
            element.element.type
              .toLowerCase()
              .includes(searchValue.toLowerCase()),
          ),
        })),
    [searchValue],
  );

  const onClickCreateItem = (elementType: ElementType) => {
    const elementsInForm = form.elements;
    let maxYElement: ElementItem | undefined = undefined;

    for (const element of elementsInForm) {
      if (!maxYElement || element.gridSize.y > maxYElement.gridSize.y) {
        maxYElement = element;
      }
    }

    if (!maxYElement) {
      return;
    }

    const newElement = createItem(elementType, {
      x: 0,
      y: maxYElement.gridSize.y - maxYElement.gridSize.h,
      ...getDefaultWidthHeight(elementType),
    });

    if (!newElement) {
      return;
    }

    setElements((prev) => [...prev, newElement]);
    setIsScrollToBottom(true);
  };

  return (
    <div className='flex h-full flex-col justify-start overflow-auto pt-4'>
      <div className='z-10 -mb-[10px] flex items-center gap-2 border-b border-transparent bg-gray-50 px-3 pb-[10px] transition duration-200'>
        <div className='relative w-full'>
          <TextInput
            value={searchValue}
            onChange={handleOnChangeSearchValue}
            placeholder='Search fields'
            size='md'
            leftSection={<CiSearch size={16} />}
            rightSection={
              <ActionIcon
                variant='transparent'
                size='lg'
                className={cn('invisible text-gray-400 hover:text-gray-500', {
                  visible: searchValue,
                })}
              >
                <IoCloseOutline size={18} />
              </ActionIcon>
            }
          />
        </div>
      </div>
      <div className='flex h-full flex-col overflow-hidden overflow-y-scroll px-3 pb-6'>
        {filteredElements.map((elementType, index) => (
          <Stack key={`category-${index}`} className='gap-0'>
            <Box className='flex p-2 '>
              <Text className='mt-6 text-sm font-medium text-gray-400'>
                {elementType.title}
              </Text>
            </Box>
            <Box className='mt-3 grid grid-cols-2 gap-4 gap-y-4 lg:grid-cols-2'>
              {elementType.elements.map(({ element }, index) => {
                const isSubmitElement = element.type === ElementType.SUBMIT;
                return (
                  <Box
                    key={`element-${index}`}
                    onClick={() => onClickCreateItem(element.type)}
                  >
                    {!isSubmitElement ? (
                      <Group
                        className='group cursor-move '
                        draggable={true}
                        unselectable='on'
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', '');
                          handleDrop(element.type);
                        }}
                      >
                        <ItemElement
                          icon={<element.icon size={ELEMENT_ICON_SIZE} />}
                          text={element.type}
                        />
                      </Group>
                    ) : (
                      <Tooltip
                        label='Your form already has one submit button'
                        position='right'
                        arrowSize={6}
                        withArrow
                        offset={15}
                        disabled={!hasSubmitButton}
                      >
                        <Group
                          className={cn('group', {
                            'cursor-not-allowed': hasSubmitButton,
                            'cursor-move ': !hasSubmitButton,
                          })}
                          draggable={!hasSubmitButton}
                          unselectable={'on'}
                          onDragStart={(e) => {
                            if (hasSubmitButton) {
                              e.preventDefault();
                              return;
                            }
                            e.dataTransfer.setData('text/plain', '');
                            handleDrop(element.type);
                          }}
                        >
                          <ItemElement
                            icon={<element.icon size={ELEMENT_ICON_SIZE} />}
                            text={element.type}
                          />
                        </Group>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Stack>
        ))}
      </div>
    </div>
  );
};
