import { ChangeEvent, useEffect, useRef } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import {
  Box,
  CloseButton,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Stack,
} from '@mantine/core';

import { Button } from '@/atoms/Button';
import { MESSAGES } from '@/constants/messages';
import { useBuildFormContext, useElementLayouts } from '@/contexts';
import { ElementItem, ElementType } from '@/types';
import { toastify } from '@/utils';

import { PropertiesRightbar } from '../PropertiesRightbar';
import { ResponsiveGridLayout } from '../ResponsiveGridLayout';

interface FormContainerProps {
  currentElementType?: ElementType;
  setCurrentLogoFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  isDisabled: boolean;
  isLoading: boolean;
}

export const FormContainer = ({
  currentElementType,
  setCurrentLogoFile,
  isDisabled,
  isLoading,
}: FormContainerProps) => {
  const { setForm, initLogo, currentLogo, setCurrentLogo } =
    useBuildFormContext();

  const logoInputRef = useRef<HTMLInputElement>(null);

  const { elements, setElements, edittingItem, setEdittingItem } =
    useElementLayouts();

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
      setForm((prevState) => ({
        ...prevState,
        logoUrl: base64Encoded,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
      setCurrentLogoFile(file);
    }
    event.target.value = '';
  };

  useEffect(() => {
    setCurrentLogo(initLogo);
  }, [initLogo, setCurrentLogo]);

  const updateItem = (item: ElementItem) => {
    setElements(
      elements.map((element) => {
        if (element.id !== edittingItem!.id) return element;
        return item;
      }),
    );
  };

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      elements: elements,
    }));
  }, [elements, setForm]);

  const handleConfig = (config: ElementItem['config']) => {
    setEdittingItem({ ...edittingItem, config: config } as ElementItem);
  };

  return (
    <Stack className='min-h-screen items-center py-7'>
      <Stack className='w-[45%] justify-between gap-7'>
        {currentLogo ? (
          <Group className='relative mx-auto'>
            <input
              type='file'
              ref={logoInputRef}
              onChange={(event) => handleLogoChange(event)}
              accept='image/*'
              className='hidden'
            />
            <Image
              src={currentLogo}
              className='h-36 w-72 flex-1 cursor-pointer object-cover'
              onClick={handleClickAddLogo}
            />
            {currentLogo === initLogo || (
              <CloseButton
                radius='lg'
                size='sm'
                icon={<IoClose size={14} />}
                onClick={() => {
                  setCurrentLogo(initLogo);
                  setForm((prevState) => ({
                    ...prevState,
                    logoUrl: initLogo,
                  }));
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
                  color='gray'
                  leftSection={<IoIosAdd size={16} />}
                  onClick={handleClickAddLogo}
                  className='my-2 text-xs font-medium uppercase'
                />
              </>
            }
            labelPosition='center'
            variant='dashed'
            className='px-4'
          />
        )}
        <Box pos='relative' className='px-4'>
          <LoadingOverlay
            visible={isLoading}
            zIndex={80}
            overlayProps={{ radius: 'sm', blur: 2, className: 'scale-x-150' }}
            loaderProps={{ color: 'green' }}
          />
          <ResponsiveGridLayout
            currentElementType={currentElementType!}
            updateItem={updateItem}
            handleConfig={handleConfig}
            isDisabled={isDisabled}
          />
        </Box>
        <PropertiesRightbar
          edittingItem={edittingItem!}
          updateItem={updateItem}
          handleConfig={handleConfig}
        />
      </Stack>
    </Stack>
  );
};
