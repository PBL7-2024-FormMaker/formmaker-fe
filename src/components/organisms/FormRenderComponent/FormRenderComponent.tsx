import { useEffect } from 'react';
import {
  Box,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
} from '@mantine/core';

import { BIG_Z_INDEX } from '@/constants';
import { useElementLayouts } from '@/contexts';
import { FactoryElement } from '@/molecules/FactoryElement';
import { ElementItem, FormRequest, FormResponse } from '@/types';
import { cn } from '@/utils';

import { ResponsiveReactGridLayout } from '../ResponsiveGridLayout';

interface FormRenderComponentProps {
  form?: FormResponse | FormRequest;
  isLoading?: boolean;
  width?: string;
}

export const FormRenderComponent = ({
  form,
  isLoading,
  width,
}: FormRenderComponentProps) => {
  const { elements, setElements } = useElementLayouts();

  const handleOnChangeAnswer = (
    elementId: string,
    fieldId: string,
    value: string,
  ) => {
    const onChangingElement = elements.find(
      (element) => element.id === elementId,
    );
    const updatedEdittingField = onChangingElement!.fields.map((field) => {
      if (field.id !== fieldId) return field;
      return {
        id: fieldId,
        name: field.name,
        text: value,
      };
    });
    setElements(
      elements.map((element) => {
        if (element.id !== onChangingElement!.id) return element;
        return {
          ...onChangingElement,
          fields: updatedEdittingField,
        } as ElementItem;
      }),
    );
  };

  useEffect(() => {
    if (form) {
      const elementsForm = form.elements as ElementItem[];
      setElements(
        elementsForm.map((element) => {
          const updatedFields = element.fields.map((field) => {
            if (!field.text) {
              return { ...field, text: '' };
            }
            return field;
          });
          return { ...element, fields: updatedFields };
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div className='flex w-full flex-col items-center'>
      {form?.logoUrl && (
        <Group
          className={cn('relative mx-auto w-full', width ? width : 'w-[45%]')}
        >
          <Image
            src={form.logoUrl}
            className='mb-8 h-36 w-72 flex-1 rounded object-cover'
          />
        </Group>
      )}
      <Stack className={cn('justify-between gap-7', width ? width : 'w-[45%]')}>
        <Box pos='relative'>
          <LoadingOverlay
            visible={isLoading || !form}
            zIndex={BIG_Z_INDEX}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'blue' }}
          />
          <div className='w-full rounded-md border border-solid border-slate-200 bg-white pb-4 shadow-lg'>
            <Text className='mt-6 p-7 px-4 text-2xl font-bold'>
              {form?.title}
            </Text>
            <Divider />
            <ResponsiveReactGridLayout
              rowHeight={30}
              isResizable={false}
              isDroppable={false}
              isDraggable={false}
              className='p-7'
            >
              {elements.map((element) => (
                <Box
                  key={element.id}
                  data-grid={element.gridSize}
                  className='flex w-full flex-col justify-center px-2'
                >
                  <FactoryElement
                    item={element}
                    isActive={false}
                    removeItem={() => {}}
                    updateItem={() => {}}
                    handleConfig={() => {}}
                    handleOnChangeAnswer={handleOnChangeAnswer}
                  />
                </Box>
              ))}
            </ResponsiveReactGridLayout>
          </div>
        </Box>
      </Stack>
    </div>
  );
};
