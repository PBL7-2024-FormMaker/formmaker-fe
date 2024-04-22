import { useEffect } from 'react';
import { Box, Image, LoadingOverlay, Stack, Text } from '@mantine/core';

import { BIG_Z_INDEX } from '@/constants';
import { useElementLayouts } from '@/contexts';
import { FactoryElement } from '@/molecules/FactoryElement';
import { ElementItem, FormRequest, FormResponse } from '@/types';

import { ResponsiveReactGridLayout } from '../ResponsiveGridLayout';

interface FormRenderComponentProps {
  form?: FormResponse | FormRequest;
  isLoading?: boolean;
}

export const FormRenderComponent = ({
  form,
  isLoading,
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
        <Image
          src={form.logoUrl}
          className='mb-8 h-[140px] w-[360px] object-cover'
        />
      )}
      <Stack className='w-[45%] justify-between gap-7'>
        <Box pos='relative'>
          <LoadingOverlay
            visible={isLoading || !form}
            zIndex={BIG_Z_INDEX}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'green' }}
          />
          <div className='w-full rounded-md border border-solid border-slate-200 bg-white p-7 shadow-lg'>
            <Text className='mt-6 px-4 text-2xl font-bold'>{form?.title}</Text>
            <ResponsiveReactGridLayout
              rowHeight={30}
              isResizable={false}
              isDroppable={false}
              isDraggable={false}
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
