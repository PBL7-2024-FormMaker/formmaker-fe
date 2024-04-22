import { TiTick } from 'react-icons/ti';
import { Group, MantineShadow, Menu as MenuMantine } from '@mantine/core';

import { Button, ButtonProps } from '@/atoms/Button';
import { SortOption } from '@/constants/sortOptions';
import { cn } from '@/utils';

interface MenuProps {
  positionArrow?: string;
  arrowOffset?: number;
  hasArrow?: boolean;
  trigger?: 'click' | 'click-hover' | 'hover';
  buttonProps: ButtonProps;
  width?: number;
  shadow?: MantineShadow;
  itemList: SortOption[];
  sortOptionIndex: number;
  handleOnClick: (item: SortOption, index: number) => void;
}

export const Menu = (props: MenuProps) => {
  const {
    buttonProps,
    trigger = 'click',
    arrowOffset = 10,
    hasArrow = false,
    itemList,
    width = 200,
    shadow = 'md',
    handleOnClick,
    sortOptionIndex,
  } = props;

  return (
    <MenuMantine
      position='bottom-start'
      trigger={trigger}
      arrowOffset={arrowOffset}
      withArrow={hasArrow}
      width={width}
      shadow={shadow}
    >
      <MenuMantine.Target>
        <Button {...buttonProps} />
      </MenuMantine.Target>
      <MenuMantine.Dropdown className='!bg-malachite-100'>
        {itemList.map((item, index) => (
          <MenuMantine.Item
            key={index}
            onClick={() => {
              handleOnClick(item, index);
            }}
            rightSection={
              itemList[sortOptionIndex].field === item.field &&
              itemList[sortOptionIndex].sortDirection === item.sortDirection ? (
                <TiTick className='text-white' />
              ) : null
            }
            className={cn(
              'mb-1 font-medium text-gray-800 transition-all duration-75 ease-linear last-of-type:mb-0 hover:bg-malachite-400 hover:text-white',
              {
                'bg-malachite-400 text-white':
                  itemList[sortOptionIndex].field === item.field &&
                  itemList[sortOptionIndex].sortDirection ===
                    item.sortDirection,
              },
            )}
          >
            <Group className='gap-2'>
              {item.icon}
              {item.title}
            </Group>
          </MenuMantine.Item>
        ))}
      </MenuMantine.Dropdown>
    </MenuMantine>
  );
};
