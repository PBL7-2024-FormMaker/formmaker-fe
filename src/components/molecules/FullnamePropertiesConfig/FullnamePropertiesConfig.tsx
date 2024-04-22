import { Box, Group, Stack, Switch, Text, TextInput } from '@mantine/core';

import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { FullnameElement } from '@/types';

export const FullnamePropertiesConfig = (
  props: BasePropertiesProps<FullnameElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;

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

  const handleChangeRequired = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleConfig({
      ...edittingItem?.config,
      required: event.currentTarget.checked,
    });
    updateItem({
      ...edittingItem,
      config: {
        ...edittingItem.config,
        required: event.currentTarget.checked,
      },
    });
  };

  const handleChangeSublabels = (
    sublabelsKey: 'firstName' | 'lastName',
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  return (
    <Stack className='justify-between gap-3'>
      <Stack className='justify-between gap-2 p-3'>
        <Text className='text-base font-semibold text-white'>Field Label</Text>
        <TextInput
          autoComplete='off'
          classNames={{
            input:
              'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
          }}
          value={edittingItem?.config.fieldLabel}
          onChange={(event) => handleChangeFieldLabel(event)}
        />
      </Stack>

      <Stack className='justify-between gap-2 p-3'>
        <Text className='text-base font-semibold text-white'>Required</Text>
        <Switch
          size='lg'
          onLabel='ON'
          offLabel='OFF'
          checked={edittingItem.config.required}
          onChange={(event) => {
            handleChangeRequired(event);
          }}
          classNames={{ thumb: 'cursor-pointer', track: 'cursor-pointer' }}
        />
      </Stack>

      <Stack className='justify-between gap-2 p-3'>
        <Text className='text-base font-semibold text-white'>Sublabels</Text>
        <Box
          className='flex flex-col justify-between gap-0 rounded-sm 
       border border-solid border-gray-400'
        >
          <Group className='flex-nowrap items-center justify-between p-3'>
            <Text className='w-[40%] text-white'>First Name</Text>
            <TextInput
              autoComplete='off'
              classNames={{
                root: 'w-[60%]',
                input:
                  'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
              }}
              value={edittingItem?.config.sublabels.firstName}
              onChange={(event) => {
                handleChangeSublabels('firstName', event);
              }}
            />
          </Group>
          <Group className='flex-nowrap items-center justify-between p-3'>
            <Text className='w-[40%] text-white'>Last Name</Text>
            <TextInput
              autoComplete='off'
              classNames={{
                root: 'w-[60%]',
                input:
                  'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
              }}
              value={edittingItem?.config.sublabels.lastName}
              onChange={(event) => {
                handleChangeSublabels('lastName', event);
              }}
            />
          </Group>
        </Box>
      </Stack>
    </Stack>
  );
};
