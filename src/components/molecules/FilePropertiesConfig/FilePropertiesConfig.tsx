import { useState } from 'react';
import { Stack, Switch, Text, TextInput } from '@mantine/core';

import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { FileConfig, FileElement } from '@/types';

export const FilePropertiesConfig = (
  props: BasePropertiesProps<FileElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;
  const [required, setRequired] = useState<boolean>(
    edittingItem.config.required,
  );
  const handleChange =
    (key: keyof FileConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleChangeSwitch = (key: keyof FileConfig) => () => {
    const newStatus = !required;
    setRequired(newStatus);
    handleConfig({
      ...edittingItem?.config,
      [key]: newStatus,
    });
    updateItem({
      ...edittingItem,
      config: {
        ...edittingItem.config,
        [key]: newStatus,
      },
    });
  };
  return (
    <>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Field label</Text>
        <TextInput
          autoComplete='off'
          className='rounded-md border border-solid border-slate-600 bg-slate-100'
          value={edittingItem?.config.fieldLabel}
          onChange={handleChange('fieldLabel')}
        ></TextInput>
      </Stack>
      <Stack className='w-20 p-3'>
        <Text className='font-bold text-white'>Required</Text>
        <Switch
          size='xl'
          onLabel='ON'
          offLabel='OFF'
          checked={required}
          onChange={handleChangeSwitch('required')}
        />
      </Stack>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Sublabel</Text>
        <TextInput
          autoComplete='off'
          className='rounded-md border border-solid border-slate-600 bg-slate-100'
          value={edittingItem?.config.sublabel}
          onChange={handleChange('sublabel')}
        ></TextInput>
      </Stack>
    </>
  );
};
