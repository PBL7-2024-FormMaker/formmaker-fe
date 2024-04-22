import { PiArrowLineUp } from 'react-icons/pi';
import { UnstyledButton } from '@mantine/core';

import { useScroll } from '@/hooks';
import { cn } from '@/utils';

interface ScrollButtonProps {
  className?: string;
}

const SCROLL_THRESHOLD = 200;

export const ScrollToTopButton = ({ className }: ScrollButtonProps) => {
  const isVisible = useScroll(SCROLL_THRESHOLD);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <UnstyledButton
      className={cn('flex flex-col items-center gap-2 ', className, {
        hidden: !isVisible,
      })}
      onClick={handleClick}
    >
      <PiArrowLineUp
        size={40}
        className='rounded border-2 border-solid border-black pb-1'
      />
      <span className='text-xs'>Go to top</span>
    </UnstyledButton>
  );
};
