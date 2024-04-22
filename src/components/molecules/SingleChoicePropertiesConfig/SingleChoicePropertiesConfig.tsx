import { ChangeEvent } from 'react';
import { Group, Stack, Switch, Text, Textarea, TextInput } from '@mantine/core';

import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { SingleChoiceElement } from '@/types';

export const SingleChoicePropertiesConfig = (
  props: BasePropertiesProps<SingleChoiceElement>,
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

  const handleChangeOptions = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleConfig({
      ...edittingItem?.config,
      options: event.currentTarget.value.split('\n'),
    });
    updateItem({
      ...edittingItem,
      gridSize: {
        ...edittingItem?.gridSize,
        h: event.currentTarget.value.split('\n').length + 3,
      },
      config: {
        ...edittingItem?.config,
        options: event.currentTarget.value.split('\n'),
      },
    });
  };

  const handleChangeIsOtherOptionDisplayed = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleConfig({
      ...edittingItem?.config,
      otherOption: {
        ...edittingItem?.config.otherOption,
        isDisplayed: event.currentTarget.checked,
      },
    });
    updateItem({
      ...edittingItem,
      gridSize: {
        ...edittingItem?.gridSize,
        h: event.currentTarget.checked
          ? edittingItem?.config.options.length + 4
          : edittingItem?.config.options.length + 3,
      },
      config: {
        ...edittingItem.config,
        otherOption: {
          ...edittingItem.config.otherOption,
          isDisplayed: event.currentTarget.checked,
        },
      },
    });
  };

  const handleChangeOptionText = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleConfig({
      ...edittingItem?.config,
      otherOption: {
        ...edittingItem?.config.otherOption,
        text: event.currentTarget.value,
      },
    });
    updateItem({
      ...edittingItem,
      gridSize: {
        ...edittingItem?.gridSize,
        h: edittingItem?.config.options.length + 4,
      },
      config: {
        ...edittingItem.config,
        otherOption: {
          ...edittingItem.config.otherOption,
          text: event.currentTarget.value,
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
          onChange={handleChangeFieldLabel}
        />
      </Stack>

      <Stack className='justify-between gap-2 p-3'>
        <Text className='text-base font-semibold text-white'>Required</Text>
        <Switch
          size='lg'
          onLabel='ON'
          offLabel='OFF'
          checked={edittingItem.config.required}
          onChange={handleChangeRequired}
          classNames={{ thumb: 'cursor-pointer', track: 'cursor-pointer' }}
        />
      </Stack>

      <Stack className='justify-between gap-2 p-3'>
        <Text className='text-base font-semibold text-white'>Options</Text>
        <Textarea
          autosize
          minRows={4}
          maxRows={5}
          resize='vertical'
          value={edittingItem.config.options.join('\n')}
          onChange={handleChangeOptions}
          classNames={{
            input:
              'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
          }}
        />
        <Text className='text-justify text-[13px] text-slate-50'>
          Give options for users to select from. Enter each option on a new
          line.
        </Text>
      </Stack>

      <Stack className='justify-between gap-2 p-3'>
        <Text className='text-base font-semibold text-white'>
          Display Other Option
        </Text>
        <Group className='items-center justify-between gap-5'>
          <Switch
            size='lg'
            onLabel='ON'
            offLabel='OFF'
            checked={edittingItem.config.otherOption.isDisplayed}
            onChange={handleChangeIsOtherOptionDisplayed}
            classNames={{ thumb: 'cursor-pointer', track: 'cursor-pointer' }}
          />
          <TextInput
            className={`transition-all duration-100 ease-linear ${edittingItem.config.otherOption.isDisplayed ? 'visible' : 'invisible'}`}
            autoComplete='off'
            classNames={{
              root: 'flex-1',
              input:
                'bg-slate-100 text-black border-none outline-none hover:bg-slate-200',
            }}
            value={edittingItem?.config.otherOption.text}
            onChange={handleChangeOptionText}
          />
        </Group>
      </Stack>
    </Stack>
  );
};
