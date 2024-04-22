import { IoSettingsSharp } from 'react-icons/io5';
import { RiDeleteBinFill } from 'react-icons/ri';
import { Box, Stack, Text } from '@mantine/core';

import { useBuildFormContext, useElementLayouts } from '@/contexts';

interface InteractiveIconProps {
  removeItem: (id: string) => void;
}

export const InteractiveIcons = ({ removeItem }: InteractiveIconProps) => {
  const { edittingItem } = useElementLayouts();

  const { toggledRightbar, setToggledRightbar } = useBuildFormContext();

  return (
    <>
      <Stack>
        <Box
          onClick={() => {
            setToggledRightbar(!toggledRightbar);
          }}
          className='group absolute left-[100%] top-[50%] ml-3 mt-[-22px] flex translate-y-[-50%] cursor-pointer items-center justify-center gap-2 rounded-full bg-malachite-500 p-2 text-white'
        >
          <IoSettingsSharp className='size-5' />
          <Text className='hidden pr-1 text-sm group-hover:inline-block'>
            Properties
          </Text>
        </Box>
        <Box
          onClick={() => removeItem(edittingItem!.id)}
          className='group absolute bottom-[50%] left-[100%] mb-[-22px] ml-3 flex translate-y-[50%] cursor-pointer items-center justify-center gap-2 rounded-full bg-error p-2 text-white'
        >
          <RiDeleteBinFill className='size-5' />
          <Text className='hidden pr-1 text-sm group-hover:inline-block'>
            Remove
          </Text>
        </Box>
      </Stack>
    </>
  );
};
