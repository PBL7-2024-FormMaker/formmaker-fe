import { Button, Stack } from '@mantine/core';

import { ALIGNMENT_OPTIONS } from '@/constants/buttonStyles';
import { useElementLayouts } from '@/contexts';
import { SubmitElement } from '@/types';
import { cn } from '@/utils';

import { BaseElementProps } from '../FactoryElement';

export const BaseSubmitElement = (props: BaseElementProps<SubmitElement>) => {
  const { item } = props;

  const { isReadOnly } = useElementLayouts();
  const getAlignmentClass = (buttonAlignment: string) => {
    if (!ALIGNMENT_OPTIONS.includes(buttonAlignment)) {
      buttonAlignment = 'auto';
    }

    return (
      {
        center: 'items-center',
        right: 'items-end',
        left: 'items-start',
        auto: 'items-auto',
      }[buttonAlignment] || ''
    );
  };

  const alignment = getAlignmentClass(item.config.buttonAlignment);

  return (
    <Stack className={`py-2 ${alignment}`}>
      <Button
        type='submit'
        className={cn('h-[48px] w-[190px]', { 'cursor-text': isReadOnly })}
        disabled={isReadOnly}
        style={{ backgroundColor: item.config.buttonColor, color: 'white' }}
      >
        {item.config.buttonText}
      </Button>
    </Stack>
  );
};
