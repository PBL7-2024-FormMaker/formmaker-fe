import { motion } from 'framer-motion';

import { ElementActionKeys } from '@/types';
import { cn } from '@/utils';

interface ButtonIconProps {
  isHovered: boolean;
  icon: React.ReactNode;
  title: string;
  elementId: number;
  className?: string;
  onClick: (elementId: number) => void;
  handleHovered: React.Dispatch<React.SetStateAction<ElementActionKeys | null>>;
}

export const ButtonIcon = (props: ButtonIconProps) => {
  const {
    icon,
    title,
    onClick,
    isHovered,
    handleHovered,
    className,
    elementId,
  } = props;

  return (
    <motion.button
      onClick={() => onClick(elementId)}
      layout
      className={cn(
        `w-10 rounded-lg border-none bg-malachite-100 p-3`,
        className,
        {
          'w-24 rounded-full': isHovered,
        },
      )}
      onMouseOver={() => handleHovered(title)}
      onMouseOut={() => handleHovered(null)}
    >
      {isHovered ? (
        <div className='flex items-center'>
          {icon}
          <div>{title}</div>
        </div>
      ) : (
        icon
      )}
    </motion.button>
  );
};
