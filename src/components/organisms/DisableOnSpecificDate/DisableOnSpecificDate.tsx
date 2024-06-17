import { useEffect, useRef, useState } from 'react';
import { IoTime } from 'react-icons/io5';
import { LuCalendarCheck2 } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import {
  ActionIcon,
  Combobox,
  Group,
  Input,
  InputBase,
  Stack,
  Text,
  useCombobox,
} from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';

import {
  useGetFormDetailsQuery,
  useUpdateDisabledOnspecificDateStatusMutation,
  useUpdateDisabledStatusMutation,
} from '@/redux/api/formApi';
import { formatDate, toastify } from '@/utils';

import { MESSAGES } from '../../../constants';

export const DisableOnSpecificDate = () => {
  const formStatus = ['Disable', 'Enable', 'Disable on specific date'];
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = formStatus.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));
  const { id: formId } = useParams();

  const { data: form } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );
  const [updateDisabledOnspecificDateStatus] =
    useUpdateDisabledOnspecificDateStatusMutation();
  const [updateDisabledStatus] = useUpdateDisabledStatusMutation();
  const ref = useRef<HTMLInputElement>(null);
  const deafaultHour = new Date().getHours() + 1;
  const minuteNow = new Date().getMinutes();
  const defaultTime = `${deafaultHour}:${minuteNow}`;
  const [formStatusValue, setFormStatusValue] = useState<string>(formStatus[1]);
  const [disableDateValue, setDisableDateValue] = useState<Date>(new Date());
  const [disableTimeValue, setDisableTimeValue] = useState<string>(defaultTime);

  const pickerControl = (
    <ActionIcon
      variant='subtle'
      color='gray'
      onClick={() => ref.current?.showPicker()}
    >
      <IoTime />
    </ActionIcon>
  );

  useEffect(() => {
    if (form) {
      setDisableDateValue(new Date(form.specificDate));
      setDisableTimeValue(formatDate(form.specificDate, 'H:mm'));
      if (form.disabledOnSpecificDate) {
        setFormStatusValue(formStatus[2]);
      } else if (form.disabled) {
        setFormStatusValue(formStatus[0]);
      } else if (!form.disabled) {
        setFormStatusValue(formStatus[1]);
      }
    }
  }, [form]);
  const handleSetDisableSpecificDate = (
    disableDateValue: Date,
    disableTimeValue: string,
  ) => {
    if (!form?.id) return;
    const timeArray = disableTimeValue.split(':');
    const hour = parseInt(timeArray[0]);
    const munite = parseInt(timeArray[1]);
    disableDateValue.setHours(hour);
    disableDateValue.setMinutes(munite);
    updateDisabledOnspecificDateStatus({
      formId: form.id,
      disabledOnSpecificDate: true,
      specificDate: disableDateValue,
    }).catch(() => {
      toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
      return;
    });
    setDisableDateValue(disableDateValue);
  };
  const handleUpdateFormStatus = (formStatusValue: string) => {
    if (!form?.id) return;
    if (formStatusValue === formStatus[0]) {
      updateDisabledStatus({
        formId: form.id,
        disabled: true,
      }).catch(() => {
        toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
        return;
      });
      updateDisabledOnspecificDateStatus({
        formId: form.id,
        disabledOnSpecificDate: false,
        specificDate: disableDateValue,
      }).catch(() => {
        toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
        return;
      });
      setFormStatusValue(formStatus[0]);
    }
    if (formStatusValue === formStatus[1]) {
      updateDisabledStatus({
        formId: form.id,
        disabled: false,
      }).catch(() => {
        toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
        return;
      });
      updateDisabledOnspecificDateStatus({
        formId: form.id,
        disabledOnSpecificDate: false,
        specificDate: disableDateValue,
      }).catch(() => {
        toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
        return;
      });
      setFormStatusValue(formStatus[1]);
    }
    if (formStatusValue === formStatus[2]) {
      updateDisabledOnspecificDateStatus({
        formId: form.id,
        disabledOnSpecificDate: true,
        specificDate: disableDateValue,
      }).catch(() => {
        toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
        return;
      });
      updateDisabledStatus({
        formId: form.id,
        disabled: false,
      }).catch(() => {
        toastify.displayError(MESSAGES.UPDATE_FORM_STATUS_FAILED);
        return;
      });
      setFormStatusValue(formStatus[2]);
    }
  };
  return (
    <Stack className='mt-4 gap-4 rounded border border-solid border-blue-50 bg-white px-6 py-8'>
      <Stack className='gap-[3px]'>
        <Group className='items-center justify-between gap-2'>
          <Stack className='gap-[3px]'>
            <span className='text-base font-semibold text-blue-200'>
              Form status
            </span>
            <span className='text-sm text-gray-500'>
              Enable, disable, or disable on specific date
            </span>
          </Stack>
        </Group>
        <Combobox
          store={combobox}
          onOptionSubmit={(val) => {
            handleUpdateFormStatus(val);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              component='button'
              type='button'
              pointer
              rightSection={<Combobox.Chevron />}
              rightSectionPointerEvents='none'
              onClick={() => combobox.toggleDropdown()}
            >
              {formStatusValue || (
                <Input.Placeholder>Pick value</Input.Placeholder>
              )}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Stack>
      {formStatusValue === formStatus[2] && (
        <Group className='items-center justify-between gap-2'>
          <Stack className='w-full gap-[3px]'>
            <span className='text-base font-semibold text-blue-200'>
              Expiration Date
            </span>
            <span className='text-sm text-gray-500'>
              Disable form on a date
            </span>
            <Group className='w-full justify-between'>
              <DatePickerInput
                placeholder='Pick date'
                value={disableDateValue}
                onChange={(e) => {
                  setDisableDateValue(e as Date);
                  handleSetDisableSpecificDate(e as Date, disableTimeValue);
                }}
                leftSection={<LuCalendarCheck2 />}
                className='w-2/5'
                minDate={new Date()}
              />
              <Text className='text-slate-500'> at </Text>
              <TimeInput
                ref={ref}
                rightSection={pickerControl}
                className='w-2/5'
                onChange={(e) => {
                  setDisableTimeValue(e.target.value);
                  handleSetDisableSpecificDate(
                    disableDateValue,
                    e.target.value,
                  );
                }}
                value={disableTimeValue}
              />
            </Group>
          </Stack>
        </Group>
      )}
    </Stack>
  );
};
