import { ChangeEvent, useEffect, useRef } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { CloseButton, Divider, Group, Image, Stack } from '@mantine/core';
import io from 'socket.io-client';

import { Button } from '@/atoms/Button';
import { BACK_END_URL } from '@/configs';
import { MESSAGES } from '@/constants/messages';
import { useBuildFormContext, useElementLayouts } from '@/contexts';
import {
  useGetFormDetailsQuery,
  useUpdateFormMutation,
} from '@/redux/api/formApi';
import { useUploadImageMutation } from '@/redux/api/imageApi';
import { ElementItem, ElementType, ErrorResponse } from '@/types';
import { toastify } from '@/utils';
import { separateFields, separateFieldsInElements } from '@/utils/seperates';

import { PropertiesRightbar } from '../PropertiesRightbar';
import { ResponsiveGridLayout } from '../ResponsiveGridLayout';

interface FormContainerProps {
  currentElementType?: ElementType;
}

const socket = io(BACK_END_URL);

export const FormContainer = ({ currentElementType }: FormContainerProps) => {
  const { form, initLogo, currentLogo, setCurrentLogo } = useBuildFormContext();

  const logoInputRef = useRef<HTMLInputElement>(null);

  const { elements, setElements, edittingItem, setEdittingItem } =
    useElementLayouts();

  const [updateForm] = useUpdateFormMutation();

  const [uploadImage] = useUploadImageMutation();

  const { refetch } = useGetFormDetailsQuery(
    { id: form.id || '' },
    { skip: !form.id },
  );

  const handleUpdateFormWhenLogoChanged = (
    formId?: string,
    currentLogoFile?: File,
  ) => {
    const filteredForm = separateFields(form);
    if (!formId) return;
    if (currentLogoFile) {
      return uploadImage(currentLogoFile).then((imgRes) => {
        if ('data' in imgRes) {
          const logoUrl = imgRes.data!.data.url;

          return updateForm({
            id: formId,
            data: {
              ...filteredForm,
              logoUrl,
            },
          }).then((res) => {
            if ('data' in res) {
              return;
            }

            return toastify.displayError((res.error as ErrorResponse).message);
          });
        }

        return toastify.displayError((imgRes.error as ErrorResponse).message);
      });
    }

    return updateForm({
      id: formId,
      data: {
        ...filteredForm,
        logoUrl: '',
      },
    }).then((res) => {
      if ('data' in res) {
        return;
      }

      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const handleUpdateForm = (formId?: string, elements?: ElementItem[]) => {
    if (!formId || !elements) return;
    const filteredElements = separateFieldsInElements(elements);

    return updateForm({
      id: formId,
      data: { ...form, elements: filteredElements },
    }).then((res) => {
      if ('data' in res) {
        return;
      }
      return toastify.displayError((res.error as ErrorResponse).message);
    });
  };

  const handleClickAddLogo = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (!file.type.startsWith('image/')) {
      toastify.displayError(MESSAGES.ONLY_SUPPORT_IMAGE_FILE_TYPES);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Encoded = reader?.result?.toString() ?? '';
      setCurrentLogo(base64Encoded);
    };
    if (file) {
      reader.readAsDataURL(file);
      handleUpdateFormWhenLogoChanged(form.id, file);
    }
    event.target.value = '';
  };

  useEffect(() => {
    setCurrentLogo(initLogo);
  }, [initLogo, setCurrentLogo]);

  useEffect(() => {
    if (!form) return;

    socket.on(form.id!, () => {
      // Fetch the form data again
      refetch();
    });

    return () => {
      socket.off(form.id);
    };
  }, [form, refetch]);

  const updateItem = (item: ElementItem) => {
    setElements(
      elements.map((element) => {
        if (element.id !== edittingItem!.id) return element;
        return item;
      }),
    );
  };

  useEffect(() => {
    if (elements.length > 0) {
      handleUpdateForm(form.id, elements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  const handleConfig = (config: ElementItem['config']) => {
    setEdittingItem({ ...edittingItem, config: config } as ElementItem);
  };

  return (
    <Stack className='h-mainHeight py-7'>
      <Stack className='w-[65%] justify-between gap-7'>
        {currentLogo ? (
          <Group className='relative mx-auto w-full'>
            <input
              type='file'
              ref={logoInputRef}
              onChange={(event) => handleLogoChange(event)}
              accept='image/*'
              className='hidden'
            />
            <Image
              src={currentLogo}
              className='h-36 w-72 flex-1 cursor-pointer rounded object-cover'
              onClick={handleClickAddLogo}
            />
            {currentLogo && (
              <CloseButton
                radius='lg'
                size='sm'
                icon={<IoClose size={14} />}
                onClick={() => {
                  setCurrentLogo('');
                  handleUpdateFormWhenLogoChanged(form.id, undefined);
                }}
                className='absolute right-1 top-1 cursor-pointer bg-slate-200 p-0.5 text-slate-600 opacity-90 hover:bg-slate-300'
              />
            )}
          </Group>
        ) : (
          <Divider
            size='sm'
            label={
              <>
                <input
                  type='file'
                  ref={logoInputRef}
                  onChange={(event) => handleLogoChange(event)}
                  accept='image/*'
                  className='hidden'
                />
                <Button
                  title='Add your logo'
                  variant='subtle'
                  color='orange'
                  leftSection={<IoIosAdd size={16} />}
                  onClick={handleClickAddLogo}
                  className='my-2 text-xs font-medium uppercase'
                />
              </>
            }
            labelPosition='center'
            variant='dashed'
            className='px-4'
            color='orange'
          />
        )}
        <ResponsiveGridLayout
          currentElementType={currentElementType!}
          updateItem={updateItem}
          handleConfig={handleConfig}
        />
        <PropertiesRightbar
          edittingItem={edittingItem!}
          updateItem={updateItem}
          handleConfig={handleConfig}
        />
      </Stack>
    </Stack>
  );
};
