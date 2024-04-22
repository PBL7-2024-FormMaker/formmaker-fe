import { useState } from 'react';
import { Box, Group, Stack, Switch, Text, TextInput } from '@mantine/core';

import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { AddressConfig, AddressElement } from '@/types';

export const AddressPropertiesConfig = (
  props: BasePropertiesProps<AddressElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;
  const [required, setRequired] = useState<boolean>(
    edittingItem.config.required,
  );
  const handleChangeFieldLabel = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleConfig({
      ...edittingItem?.config,
      fieldLabel: event.currentTarget.value,
    });
    updateItem({
      ...edittingItem,
      config: {
        ...edittingItem.config,
        fieldLabel: event.currentTarget.value,
      },
    });
  };
  const handleChangeSublabels =
    (sublabelsKey: 'street' | 'ward' | 'district' | 'city') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleConfig({
        ...edittingItem?.config,
        sublabels: {
          ...edittingItem?.config.sublabels,
          [sublabelsKey]: event.currentTarget.value,
        },
      });
      updateItem({
        ...edittingItem,
        config: {
          ...edittingItem?.config,
          sublabels: {
            ...edittingItem?.config.sublabels,
            [sublabelsKey]: event.currentTarget.value,
          },
        },
      });
    };
  const handleChangeSwitch = (key: keyof AddressConfig) => () => {
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
          value={(edittingItem?.config as AddressConfig).fieldLabel}
          onChange={handleChangeFieldLabel}
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

      <Stack className='justify-between gap-2 p-3'>
        <Text className='text-base font-semibold text-white'>Sublabels</Text>
        <Box
          className='flex flex-col justify-between gap-0 rounded-sm 
       border border-solid border-gray-400'
        >
          <Group className='flex-nowrap items-center justify-between p-3'>
            <Text className='w-[40%] text-white'>Street</Text>
            <TextInput
              autoComplete='off'
              classNames={{
                root: 'w-[60%]',
                input:
                  'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
              }}
              value={edittingItem?.config.sublabels.street}
              onChange={handleChangeSublabels('street')}
            />
          </Group>
          <Group className='flex-nowrap items-center justify-between p-3'>
            <Text className='w-[40%] text-white'>Ward</Text>
            <TextInput
              autoComplete='off'
              classNames={{
                root: 'w-[60%]',
                input:
                  'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
              }}
              value={edittingItem?.config.sublabels.ward}
              onChange={handleChangeSublabels('ward')}
            />
          </Group>
          <Group className='flex-nowrap items-center justify-between p-3'>
            <Text className='w-[40%] text-white'>District</Text>
            <TextInput
              autoComplete='off'
              classNames={{
                root: 'w-[60%]',
                input:
                  'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
              }}
              value={edittingItem?.config.sublabels.district}
              onChange={handleChangeSublabels('district')}
            />
          </Group>
          <Group className='flex-nowrap items-center justify-between p-3'>
            <Text className='w-[40%] text-white'>City</Text>
            <TextInput
              autoComplete='off'
              classNames={{
                root: 'w-[60%]',
                input:
                  'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
              }}
              value={edittingItem?.config.sublabels.city}
              onChange={handleChangeSublabels('city')}
            />
          </Group>
        </Box>
      </Stack>
    </>
  );
};
