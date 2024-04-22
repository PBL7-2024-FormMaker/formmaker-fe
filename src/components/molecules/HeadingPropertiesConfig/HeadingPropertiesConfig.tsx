import { Stack, Text, TextInput } from '@mantine/core';

import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { HeadingConfig, HeadingElement } from '@/types';

export const HeadingProptertiesConfig = (
  props: BasePropertiesProps<HeadingElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;

  const handleChange =
    (key: keyof HeadingConfig) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleConfig({
        ...edittingItem.config,
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

  return (
    <>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Heading text</Text>
        <TextInput
          autoComplete='off'
          className='rounded-md border border-solid border-slate-600 bg-slate-100'
          value={edittingItem.config.headingText}
          onChange={handleChange('headingText')}
        />
      </Stack>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Subheading text</Text>
        <TextInput
          autoComplete='off'
          className='rounded-md border border-solid border-slate-600 bg-slate-100'
          value={edittingItem.config.subheadingText}
          onChange={handleChange('subheadingText')}
        />
      </Stack>
    </>
  );
};
