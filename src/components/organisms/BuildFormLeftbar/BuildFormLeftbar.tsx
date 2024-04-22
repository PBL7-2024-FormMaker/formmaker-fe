import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { Box, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';

import { Button } from '@/atoms/Button';
import { ElementList } from '@/configs';
import { useElementLayouts } from '@/contexts';
import { ElementType } from '@/types';
import { cn } from '@/utils';

const elementList = ElementList;
interface BuildFormLeftbarProps {
  setCurrentElementType: (element: ElementType) => void;
}

const ELEMENT_ICON_SIZE = 25;

export const BuildFormLeftbar = ({
  setCurrentElementType,
}: BuildFormLeftbarProps) => {
  const { elements } = useElementLayouts();

  const [toggledLeftbar, setToggledLeftbar] = useState(false);

  const [scroll] = useWindowScroll();

  const hasSubmitButton = elements.some(
    (element) => element.type === ElementType.SUBMIT,
  );

  const handleDrop = (elementType: ElementType) => {
    setCurrentElementType(elementType);
  };

  return (
    <Box>
      <Button
        size='sm'
        title='Add form element'
        color='gray'
        onClick={() => {
          setToggledLeftbar(true);
        }}
        className={cn(
          'fixed left-0 top-[160px] h-12 w-[170px] -translate-x-[170px] rounded-l-none rounded-r-full bg-slate-500 py-1 pr-0 text-sm leading-4 transition-all duration-500 ease-linear',
          { 'translate-x-[0]': !toggledLeftbar },
          { 'top-[90px]': scroll.y > 0 },
        )}
        rightSection={
          <Box className='relative flex h-12 w-12'>
            <Box className='absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-600 opacity-80'></Box>
            <Box className='relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-600'>
              <FaPlus size={20} />
            </Box>
          </Box>
        }
        classNames={{ label: '!whitespace-normal w-[100px]', inner: 'pr-[0]' }}
      />
      <Box
        className={cn(
          'fixed bottom-0 left-0 top-[120px] w-[320px] -translate-x-[320px] overflow-y-scroll bg-slate-500 transition-all duration-500 ease-linear',
          { 'translate-x-[0]': toggledLeftbar },
          { 'top-[50px]': scroll.y > 0 },
        )}
      >
        <IoMdClose
          className='absolute right-2 top-2 size-6 cursor-pointer text-white transition-all duration-150 ease-linear hover:bg-slate-600'
          onClick={() => {
            setToggledLeftbar(false);
          }}
        />
        <Box>
          <Stack className='gap-0'>
            <Box className='flex p-3 text-white'>
              <Text size='lg'>Form Elements</Text>
            </Box>
            <Divider color='gray' />
            {elementList.map((elementType, index) => (
              <Stack key={`category-${index}`} className='gap-0'>
                <Box className='flex justify-center bg-slate-600 p-2 uppercase text-slate-300'>
                  <Text className='text-[13px]'>{elementType.title}</Text>
                </Box>
                <Divider color='gray' />
                <Box>
                  {elementType.elements.map(({ element }, index) => {
                    const isSubmitElement = element.type === ElementType.SUBMIT;
                    return (
                      <Box key={`element-${index}`}>
                        {!isSubmitElement ? (
                          <Group
                            className='group cursor-move hover:bg-malachite-500'
                            draggable={true}
                            unselectable='on'
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', '');
                              handleDrop(element.type);
                            }}
                          >
                            <Box className='flex bg-slate-600 p-3 text-white group-hover:bg-malachite-400'>
                              <element.icon size={ELEMENT_ICON_SIZE} />
                            </Box>
                            <Box className='text-white'>{element.type}</Box>
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
                                'cursor-move hover:bg-malachite-500':
                                  !hasSubmitButton,
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
                              <Box
                                className={cn(
                                  'flex bg-slate-600 p-3 text-white',
                                  {
                                    'group-hover:bg-malachite-400':
                                      !hasSubmitButton,
                                  },
                                )}
                              >
                                <element.icon size={ELEMENT_ICON_SIZE} />
                              </Box>
                              <Box className='text-white'>{element.type}</Box>
                            </Group>
                          </Tooltip>
                        )}
                        <Divider color='gray' />
                      </Box>
                    );
                  })}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
