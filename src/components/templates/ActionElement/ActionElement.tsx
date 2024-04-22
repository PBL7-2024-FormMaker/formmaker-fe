import { useState } from 'react';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

import { ButtonIcon } from '@/atoms/Button';
import { ElementActionKeys, ElementActions } from '@/types';
import { cn } from '@/utils';

interface ActionElementProps {
  elementId: number;
  content: React.ReactNode;
}

export const ActionElement = (props: ActionElementProps) => {
  const { content, elementId } = props;
  const [hoveredActionKey, setHoveredActionKey] =
    useState<ElementActionKeys | null>(null);
  const actionKeys = [
    {
      title: ElementActions.Delete,
      icon: <MdDelete className='mt-[2px]' />,
      onClick: () => {},
    },
    {
      title: ElementActions.Setting,
      icon: <IoSettingsSharp className='mt-[2px]' />,
      onClick: () => {},
    },
  ];

  return (
    <div
      className={cn('relative px-2 py-1', {
        'rounded-md border border-solid border-malachite-200':
          hoveredActionKey !== null,
      })}
    >
      {content}
      <div className='absolute -bottom-10 right-[50%] flex items-center gap-1'>
        {actionKeys.map((actionKey) => (
          <ButtonIcon
            title={actionKey.title}
            className={
              actionKey.title === ElementActions.Delete
                ? 'bg-light-error'
                : undefined
            }
            icon={actionKey.icon}
            onClick={actionKey.onClick}
            elementId={elementId}
            isHovered={hoveredActionKey === actionKey.title}
            handleHovered={setHoveredActionKey}
          />
        ))}
      </div>
    </div>
  );
};
