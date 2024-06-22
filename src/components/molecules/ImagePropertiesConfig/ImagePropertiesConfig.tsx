import { ChangeEvent, useRef, useState } from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';
import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  NumberInput,
  Radio,
  Stack,
  Text,
} from '@mantine/core';

import { Button } from '@/atoms/Button';
import { MESSAGES } from '@/constants';
import { BasePropertiesProps } from '@/organisms/PropertiesRightbar';
import { useUploadImageMutation } from '@/redux/api/imageApi';
import { ErrorResponse, ImageConfig, ImageElement } from '@/types';
import { capitalize, cn, toastify } from '@/utils';

import { ALIGNMENT_OPTIONS } from '../../../constants/buttonStyles';

export const ImagePropertiesConfig = (
  props: BasePropertiesProps<ImageElement>,
) => {
  const { edittingItem, updateItem, handleConfig } = props;
  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [currentImage, setCurrentImage] = useState<string>();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editingFieldName, setEdditingFieldName] = useState<string>('');
  const [aspectRatio, setAspecRatio] = useState<number>(1);
  const [lockWidthHeight, setLockWidthHeight] = useState<boolean>(true);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file.type.startsWith('image/')) {
      toastify.displayError(MESSAGES.ONLY_SUPPORT_IMAGE_FILE_TYPES);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Encoded = reader?.result?.toString() ?? '';
      setCurrentImage(base64Encoded);
      setEdditingFieldName(edittingItem.id);
      const image = new Image();
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        const aspectRatio = width / height;
        setAspecRatio(aspectRatio);
      };
      image.src = base64Encoded;
    };
    if (file) {
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
    event.target.value = '';
  };

  const handleUpdateImage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (selectedFile) {
      uploadImage(selectedFile).then((res) => {
        if ('data' in res) {
          handleConfig({ ...edittingItem.config, image: res.data!.data.url });
          updateItem({
            ...edittingItem,
            config: {
              ...edittingItem.config,
              image: res.data!.data.url,
            },
          });
          setEdditingFieldName('');
          return;
        }
        if (res.error as ErrorResponse)
          toastify.displayError((res.error as ErrorResponse).message);
      });
    }
  };

  const handleChangeAligment = (value: string) => {
    console.log('editingItem', edittingItem);

    handleConfig({
      ...edittingItem?.config,
      imageAlignment: value,
    });
    updateItem({
      ...edittingItem,
      config: {
        ...edittingItem.config,
        imageAlignment: value,
      },
      gridSize: {
        ...edittingItem?.gridSize,
        h: Math.ceil(
          (Math.floor(parseInt(edittingItem.config.size.height) * aspectRatio) +
            12) /
            40,
        ),
      },
    });
  };

  const handleRemoveImage = () => {
    handleConfig({ ...edittingItem.config, image: '' });
    updateItem({
      ...edittingItem,
      config: {
        ...edittingItem.config,
        image: '',
      },
    });
  };
  const handleChangeSizeImage = (
    key: keyof ImageConfig['size'],
    value: string | number,
  ) => {
    if (value === '') {
      value = '1';
    }
    if (key === 'width') {
      if (lockWidthHeight) {
        handleConfig({
          ...edittingItem.config,
          size: {
            [key]: value.toString(),
            height: Math.floor(
              parseInt(value.toString()) * aspectRatio,
            ).toString(),
          },
        });
        updateItem({
          ...edittingItem,
          gridSize: {
            ...edittingItem?.gridSize,
            h: Math.ceil(
              (Math.floor(parseInt(value.toString()) * aspectRatio) + 12) / 40,
            ),
          },
          config: {
            ...edittingItem.config,
            size: {
              [key]: value.toString(),
              height: Math.floor(
                parseInt(value.toString()) * aspectRatio,
              ).toString(),
            },
          },
        });
      }
      if (!lockWidthHeight) {
        handleConfig({
          ...edittingItem.config,
          size: {
            ...edittingItem.config.size,
            [key]: value.toString(),
          },
        });
        updateItem({
          ...edittingItem,
          gridSize: {
            ...edittingItem?.gridSize,
            h: Math.ceil((+value + 12) / 40),
          },
          config: {
            ...edittingItem.config,
            size: {
              ...edittingItem.config.size,
              [key]: value.toString(),
            },
          },
        });
      }
    }

    if (key === 'height') {
      if (lockWidthHeight) {
        handleConfig({
          ...edittingItem.config,
          size: {
            [key]: value.toString(),
            width: Math.floor(
              parseInt(value.toString()) * (1 / aspectRatio),
            ).toString(),
          },
        });
        updateItem({
          ...edittingItem,
          gridSize: {
            ...edittingItem?.gridSize,
            h: Math.ceil((+value + 10) / 40),
          },
          config: {
            ...edittingItem.config,
            size: {
              [key]: value.toString(),
              width: Math.floor(
                parseInt(value.toString()) * (1 / aspectRatio),
              ).toString(),
            },
          },
        });
      }
      if (!lockWidthHeight) {
        handleConfig({
          ...edittingItem.config,
          size: {
            ...edittingItem.config.size,
            [key]: value.toString(),
          },
        });
        updateItem({
          ...edittingItem,
          gridSize: {
            ...edittingItem?.gridSize,
            h: Math.ceil((+value + 10) / 40),
          },
          config: {
            ...edittingItem.config,
            size: {
              ...edittingItem.config.size,
              [key]: value.toString(),
            },
          },
        });
      }
    }
  };

  return (
    <Stack className='p-3'>
      <Stack>
        <Text className='font-medium text-white'>Image</Text>
        <Group>
          {editingFieldName === edittingItem.id ? (
            <Group>
              <Box className='rounded-md bg-gray-100 p-1.5'>
                <Avatar
                  size='md'
                  variant='filled'
                  radius='sm'
                  src={currentImage ? currentImage : edittingItem.config.image}
                />
              </Box>
              <input
                type='file'
                ref={imageInputRef}
                onChange={(event) => {
                  handleImageChange(event);
                }}
                className='hidden'
                accept='image/*'
              />
              <Button
                title='Save'
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ) => handleUpdateImage(event)}
                disabled={isUploadingImage}
              />
              <Button
                title='Cancel'
                color='gray'
                onClick={() => {
                  setCurrentImage(edittingItem.config.image ?? '');
                }}
              />
            </Group>
          ) : (
            <Group>
              {edittingItem.config.image ? (
                <Box className='rounded-md bg-gray-100 p-1.5'>
                  <Avatar
                    size='md'
                    variant='filled'
                    radius='sm'
                    src={
                      edittingItem.config.image
                        ? edittingItem.config.image
                        : currentImage
                    }
                  />
                </Box>
              ) : null}
              <input
                type='file'
                ref={imageInputRef}
                onChange={(event) => {
                  handleImageChange(event);
                }}
                className='hidden'
                accept='image/*'
              />
              {edittingItem.config.image ? (
                <Group>
                  <Button
                    title='Change'
                    onClick={() => imageInputRef.current?.click()}
                  />
                  <Button
                    title='Remove'
                    color='gray'
                    onClick={handleRemoveImage}
                  />
                </Group>
              ) : (
                <Button
                  title='Choose image'
                  onClick={() => imageInputRef.current?.click()}
                />
              )}
            </Group>
          )}
        </Group>
      </Stack>
      <Divider color='gray' className='mx-[-12px]' />
      <Stack>
        <Text className='font-medium text-white'>Size</Text>
        <Group className='justify-between gap-1'>
          <Group className='w-2/5 gap-0'>
            <NumberInput
              className='w-3/4'
              hideControls
              classNames={{ input: ' rounded-none' }}
              value={edittingItem.config.size.width}
              onChange={(value) => handleChangeSizeImage('width', value)}
            />
            <Text className='bg-white px-1 py-[5px]'>PX</Text>
          </Group>
          <ActionIcon
            size={38}
            className='bg-navy-100'
            variant='filled'
            aria-label='Lock'
            onClick={() => setLockWidthHeight(!lockWidthHeight)}
          >
            {lockWidthHeight ? (
              <FaLock style={{ width: '70%', height: '70%' }} />
            ) : (
              <FaUnlock style={{ width: '70%', height: '70%' }} />
            )}
          </ActionIcon>
          <Group className='w-2/5 gap-0'>
            <NumberInput
              className='w-3/4'
              hideControls
              classNames={{ input: ' rounded-none' }}
              value={edittingItem.config.size.height}
              onChange={(value) => handleChangeSizeImage('height', value)}
              min={1}
            />
            <Text className='bg-white px-1 py-[5px]'>PX</Text>
          </Group>
        </Group>
        <Group className='justify-between'>
          <Text className='text-sm text-slate-200'>Width</Text>
          <Text className='text-sm text-slate-200'>Height</Text>
        </Group>
      </Stack>
      <Divider color='gray' className='mx-[-12px]' />
      <Stack>
        <Text className='font-medium text-white'>Image Alignment</Text>
        <Radio.Group
          value={edittingItem.config.imageAlignment}
          onChange={(value) => handleChangeAligment(value)}
        >
          <Group className='gap-0'>
            {ALIGNMENT_OPTIONS.map((alignment) => (
              <Radio
                key={alignment}
                value={alignment}
                label={capitalize(alignment)}
                classNames={{
                  inner: 'hidden',
                  label: cn(
                    'bg-slate-700 px-4 py-3 cursor-pointer text-base text-white',
                    {
                      'bg-navy-400':
                        edittingItem.config.imageAlignment === alignment,
                    },
                  ),
                }}
              />
            ))}
          </Group>
        </Radio.Group>
      </Stack>
    </Stack>
  );
};
