import { Text } from '@mantine/core';

interface ItemElementProps {
  icon: React.ReactNode;
  text: string;
}

export const ItemElement = (props: ItemElementProps) => {
  const { icon, text } = props;

  return (
    <div className='box-shadow-[0_1px_4px_rgba(0, 0, 0, 0.16)] flex h-full w-full cursor-move flex-col items-center gap-2 rounded-md border border-white bg-navy-10 px-[3px] pb-[6px] pt-3 shadow duration-300 hover:shadow-md hover:shadow-gray-400/50'>
      <div
        className='rounded border-[0.5px] p-1'
        style={{
          color: 'rgb(100, 116, 139)',
        }}
      >
        {icon}
      </div>
      <Text size='xs' className='overflow-clip' lineClamp={1}>
        {text}
      </Text>
    </div>
  );
};
