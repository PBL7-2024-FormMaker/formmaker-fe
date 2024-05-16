import { Group, Image } from '@mantine/core';

import { ALIGNMENT_OPTIONS } from '@/constants/buttonStyles';
import { ImageElement } from '@/types';

import { BaseElementProps } from '../FactoryElement';

export const BaseImageElement = (props: BaseElementProps<ImageElement>) => {
  const { item } = props;
  const getAlignmentClass = (imageAlignment: string) => {
    if (!ALIGNMENT_OPTIONS.includes(imageAlignment)) {
      imageAlignment = 'auto';
    }
    return (
      {
        center: 'justify-center',
        right: 'justify-end',
        left: 'justify-start',
        auto: 'justify-auto',
      }[imageAlignment] || ''
    );
  };

  const alignment = getAlignmentClass(item.config.imageAlignment);

  return (
    <Group className={`py-2 ${alignment}`}>
      <Image
        src={
          item.config.image
            ? item.config.image
            : 'https://www.jotform.com/images/image_placeholder.png'
        }
        h={item.config.size.height}
        w={item.config.size.width}
      />
    </Group>
  );
};
