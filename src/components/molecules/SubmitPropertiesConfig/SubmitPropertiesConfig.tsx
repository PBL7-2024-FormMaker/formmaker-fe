import { useState } from 'react';
import {
  Button,
  ColorPicker,
  Group,
  Radio,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';

import {
  ALIGNMENT_OPTIONS,
  BUTTON_COLORS,
  DEFAULT_BUTTON_COLOR,
} from '@/constants/buttonStyles';
import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { SubmitConfig, SubmitElement } from '@/types';
import { capitalize, cn } from '@/utils';

export const SubmitProptertiesConfig = (
  props: BasePropertiesProps<SubmitElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleTextChange =
    (key: keyof SubmitConfig) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleConfig({
        ...edittingItem?.config,
        [key]: event.currentTarget.value,
      });
      updateItem({
        ...edittingItem,
        config: {
          ...edittingItem.config,
          [key]: event.currentTarget.value,
        },
      });
    };

  const handleChange = (key: keyof SubmitConfig) => (value: string) => {
    handleConfig({
      ...edittingItem?.config,
      [key]: value,
    });
    updateItem({
      ...edittingItem,
      config: {
        ...edittingItem.config,
        [key]: value,
      },
    });
  };

  return (
    <>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Button text</Text>
        <TextInput
          autoComplete='off'
          className='rounded-md border border-solid border-slate-600 bg-slate-100'
          value={edittingItem.config.buttonText}
          onChange={handleTextChange('buttonText')}
        />
      </Stack>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Button Alignment</Text>
        <Radio.Group
          value={edittingItem.config.buttonAlignment}
          onChange={handleChange('buttonAlignment')}
        >
          <Group className='gap-0'>
            {ALIGNMENT_OPTIONS.map((alignment) => (
              <Radio
                key={alignment}
                value={alignment}
                label={capitalize(alignment)}
                classNames={{
                  inner: 'hidden',
                  label: cn(
                    'bg-slate-700 px-4 py-3 cursor-pointer text-base text-white',
                    {
                      'bg-malachite-400':
                        edittingItem.config.buttonAlignment === alignment,
                    },
                  ),
                }}
              />
            ))}
          </Group>
        </Radio.Group>
      </Stack>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Button Style</Text>
        <Button
          className={cn(
            'h-[40px] ',
            {
              'bg-slate-400 text-slate-800 hover:bg-slate-600 hover:text-white':
                edittingItem.config.buttonColor === DEFAULT_BUTTON_COLOR,
            },
            {
              'bg-malachite-400 text-white hover:bg-malachite-500 hover:text-white':
                edittingItem.config.buttonColor !== DEFAULT_BUTTON_COLOR,
            },
          )}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          {edittingItem.config.buttonColor === DEFAULT_BUTTON_COLOR
            ? 'CHOOOSE STYLE'
            : 'Change button style'}
        </Button>
        {showColorPicker && (
          <ColorPicker
            value={edittingItem.config.buttonColor}
            onChange={handleChange('buttonColor')}
            swatchesPerRow={5}
            format='hex'
            withPicker={false}
            className='w-full rounded bg-white px-3 py-2'
            swatches={Object.values(BUTTON_COLORS)}
          />
        )}
      </Stack>
    </>
  );
};
