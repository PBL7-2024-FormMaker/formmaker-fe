import { useState } from 'react';
import { Stack, Switch, Text, Textarea, TextInput } from '@mantine/core';

import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { DropdownConfig, DropdownElement } from '@/types';

export const DropdownPropertiesConfig = (
  props: BasePropertiesProps<DropdownElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;
  const [required, setRequired] = useState<boolean>(
    edittingItem.config.required,
  );

  const handleChange =
    (key: keyof DropdownConfig) =>
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
  const handleChangeSwitch = (key: keyof DropdownConfig) => () => {
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

  const handleChangeOptions = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const options = event.target.value.split(/\n/);

    handleConfig({
      ...edittingItem?.config,
      options,
    });
    updateItem({
      ...edittingItem,
      config: {
        ...edittingItem.config,
        options,
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
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Options</Text>
        <Textarea
          resize='vertical'
          classNames={{ input: 'min-h-[100px]' }}
          value={edittingItem?.config.options.join('\n')}
          onChange={handleChangeOptions}
        />
        <Text className='text-justify text-[13px] text-slate-50'>
          Give options for users to select from. Enter each option on a new
          line.
        </Text>
      </Stack>
    </>
  );
};
