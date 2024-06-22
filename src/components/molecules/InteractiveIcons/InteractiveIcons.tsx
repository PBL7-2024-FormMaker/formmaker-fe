import { IoSettingsSharp } from 'react-icons/io5';
import { RiDeleteBinFill } from 'react-icons/ri';
import { Box, Stack, Text, Tooltip } from '@mantine/core';

import { useBuildFormContext, useElementLayouts } from '@/contexts';
import { ElementType } from '@/types';

interface InteractiveIconProps {
  removeItem: (id: string) => void;
}

export const InteractiveIcons = ({ removeItem }: InteractiveIconProps) => {
  const { edittingItem } = useElementLayouts();

  const { toggledRightbar, setToggledRightbar } = useBuildFormContext();
  const isSubmitElement = edittingItem?.type === ElementType.SUBMIT;

  return (
    <>
      <Stack>
        <Box
          onClick={(e) => {
            e.stopPropagation();
            setToggledRightbar(!toggledRightbar);
          }}
          className='group absolute left-[100%] top-[50%] ml-3 mt-[-22px] flex translate-y-[-50%] cursor-pointer items-center justify-center gap-2 rounded-full bg-navy-500 p-2 text-white'
        >
          <IoSettingsSharp className='size-5' />
          <Text className='hidden pr-1 text-sm group-hover:inline-block'>
            Properties
          </Text>
        </Box>
        {isSubmitElement ? (
          <Tooltip
            label='Cannot remove submit button'
            position='right'
            arrowSize={6}
            withArrow
            offset={12}
          >
            <Box
              onClick={undefined}
              className='group absolute bottom-[50%] left-[100%] mb-[-22px] ml-3 flex translate-y-[50%] cursor-not-allowed items-center justify-center gap-2 rounded-full bg-red-300 p-2 text-white'
            >
              <RiDeleteBinFill className='size-5' />
              <Text className='hidden pr-1 text-sm group-hover:inline-block'>
                Remove
              </Text>
            </Box>
          </Tooltip>
        ) : (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              removeItem(edittingItem!.id);
              setToggledRightbar(false);
            }}
            className={
              'group absolute bottom-[50%] left-[100%] mb-[-22px] ml-3 flex translate-y-[50%] cursor-pointer items-center justify-center gap-2 rounded-full bg-error p-2 text-white'
            }
          >
            <RiDeleteBinFill className='size-5' />
            <Text className='hidden pr-1 text-sm group-hover:inline-block'>
              Remove
            </Text>
          </Box>
        )}
      </Stack>
    </>
  );
};
