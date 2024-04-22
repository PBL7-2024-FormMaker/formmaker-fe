import { FaSave } from 'react-icons/fa';
import { Box, LoadingOverlay, Tooltip, UnstyledButton } from '@mantine/core';

import { useScroll } from '@/hooks';
import { cn } from '@/utils';

interface SaveButtonProps {
  className?: string;
  handleSave?: () => void;
  isLoading: boolean;
  canSave: boolean;
}
const HEADER_HEIGHT = 50;

export const SaveButton = ({
  isLoading,
  canSave,
  className,
  handleSave,
}: SaveButtonProps) => {
  const isScrolling = useScroll(HEADER_HEIGHT);

  return (
    <Tooltip
      label='Save changes'
      position='left'
      arrowSize={6}
      withArrow
      offset={12}
    >
      <UnstyledButton
        type='submit'
        className={cn(
          'fixed right-10 top-[160px] flex flex-col items-center text-malachite-500 transition-all duration-500 ease-linear',
          className,
          { 'top-[90px]': isScrolling },
        )}
        onClick={handleSave}
        disabled={!canSave}
      >
        <Box pos='relative'>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ blur: 2 }}
            className='rounded-full'
            loaderProps={{ color: 'green', size: 22 }}
          />
          <span
            className={cn(
              'relative flex h-12 w-12 items-center justify-center rounded-full bg-malachite-400',
              {
                'bg-malachite-300': !canSave,
              },
            )}
          >
            {canSave && (
              <span className='absolute h-full w-full animate-ping rounded-full bg-malachite-400 opacity-65 duration-1000'></span>
            )}
            <FaSave size={24} className='text-white' />
          </span>
        </Box>
      </UnstyledButton>
    </Tooltip>
  );
};
