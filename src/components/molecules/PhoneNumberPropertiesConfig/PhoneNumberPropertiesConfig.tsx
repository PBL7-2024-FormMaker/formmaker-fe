import { Stack, Switch, Text, TextInput } from '@mantine/core';

import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { NumberPhoneElement } from '@/types';

export const PhoneNumberPropertiesConfig = (
  props: BasePropertiesProps<NumberPhoneElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;

  const handleChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      handleConfig({
        ...edittingItem?.config,
        [key]: event.target.value,
      });
      updateItem({
        ...edittingItem,
        config: {
          ...edittingItem.config,
          [key]: event.target.value,
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
  return (
    <>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Field Label</Text>
        <TextInput
          autoComplete='off'
          className='rounded-md border border-solid border-slate-600 bg-slate-100'
          value={edittingItem?.config.fieldLabel}
          onChange={handleChange('fieldLabel')}
        />
      </Stack>
      <Stack className='p-3'>
        <Text className='font-bold text-white'>Sub Label</Text>
        <TextInput
          autoComplete='off'
          className='rounded-md border border-solid border-slate-600 bg-slate-100'
          value={edittingItem?.config.sublabel}
          onChange={handleChange('sublabel')}
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
    </>
  );
};
