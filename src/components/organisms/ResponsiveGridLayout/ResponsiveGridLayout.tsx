import { useEffect, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import { Box } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

import {
  defaultAddressConfig,
  defaultDatePickerConfig,
  defaultDropdownConfig,
  defaultEmailConfig,
  defaultFullnameConfig,
  defaultHeadingConfig,
  defaultMultipleChoiceConfig,
  defaultNumberPhoneConfig,
  defaultScaleRatingConfig,
  defaultSingleChoiceConfig,
  defaultSubmitConfig,
  defaultTextConfig,
  defaultTimeInputConfig,
} from '@/configs';
import { useBuildFormContext, useElementLayouts } from '@/contexts';
import { FactoryElement } from '@/molecules/FactoryElement';
import { InteractiveIcons } from '@/molecules/InteractiveIcons';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { ElementItem, ElementType } from '@/types';
import { cn } from '@/utils';
import { getDefaultWidthHeight } from '@/utils/elements';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface ResponsiveGridLayoutProps {
  currentElementType: ElementType;
  updateItem: (item: ElementItem) => void;
  handleConfig: (config: ElementItem['config']) => void;
  isDisabled: boolean;
}

const FLEETING_INDEX = 'fleeting';

export const ResponsiveGridLayout = ({
  currentElementType,
  updateItem,
  handleConfig,
  isDisabled,
}: ResponsiveGridLayoutProps) => {
  const { elements, setElements, edittingItem, setEdittingItem } =
    useElementLayouts();
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState<{
    lg: Layout[];
    md: Layout[];
    sm: Layout[];
    xs: Layout[];
    xxs: Layout[];
  }>({ lg: [], md: [], sm: [], xs: [], xxs: [] });
  const { isEditForm, setToggledRightbar } = useBuildFormContext();
  const { id: formId } = useParams();
  const { data: form } = useGetFormDetailsQuery(
    { id: formId || '' },
    { skip: !formId },
  );

  function getLayout(element: ElementItem, layouts: Layout[]) {
    const foundlayout = layouts.find((layout) => element.id === layout.i);
    return {
      x: foundlayout!.x,
      y: foundlayout!.y,
      w: foundlayout!.w,
      h: foundlayout!.h,
    };
  }

  function getElement(elementItems: ElementItem[], layouts: Layout[]) {
    return elementItems.map((elementItem) => {
      const gridSize = getLayout(elementItem, layouts);
      return { ...elementItem, gridSize: gridSize };
    });
  }

  const removeItem = (id: string) => {
    setElements(elements.filter((element) => element.id !== id));
    setEdittingItem(undefined);
    setToggledRightbar(false);
  };

  const createItem = (
    type: string,
    currentItem: Layout,
  ): ElementItem | undefined => {
    const uid = uuidv4();
    const getGridSize = (currentItem: Layout) => ({
      x: currentItem.x,
      y: currentItem.y,
      w: currentItem.w,
      h: currentItem.h,
    });
    switch (type) {
      case ElementType.HEADING:
        return {
          id: uid,
          type: ElementType.HEADING,
          gridSize: getGridSize(currentItem),
          config: defaultHeadingConfig,
          fields: [],
        };
      case ElementType.EMAIL:
        return {
          id: uid,
          type: ElementType.EMAIL,
          gridSize: getGridSize(currentItem),
          config: defaultEmailConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'email',
              text: '',
            },
          ],
        };
      case ElementType.FULLNAME:
        return {
          id: uid,
          type: ElementType.FULLNAME,
          gridSize: getGridSize(currentItem),
          config: defaultFullnameConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'firstName',
              text: '',
            },
            {
              id: uuidv4(),
              name: 'lastName',
              text: '',
            },
          ],
        };
      case ElementType.SUBMIT:
        return {
          id: uid,
          type: ElementType.SUBMIT,
          gridSize: getGridSize(currentItem),
          config: defaultSubmitConfig,
          fields: [],
        };
      case ElementType.SHORT_TEXT:
        return {
          id: uid,
          type: ElementType.SHORT_TEXT,
          gridSize: getGridSize(currentItem),
          config: defaultTextConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'shortText',
            },
          ],
        };
      case ElementType.LONG_TEXT:
        return {
          id: uid,
          type: ElementType.LONG_TEXT,
          gridSize: getGridSize(currentItem),
          config: defaultTextConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'longText',
            },
          ],
        };
      case ElementType.SCALE_RATING:
        return {
          id: uid,
          type: ElementType.SCALE_RATING,
          gridSize: getGridSize(currentItem),
          config: defaultScaleRatingConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'scaleRating',
              text: '',
            },
          ],
        };
      case ElementType.ADDRESS:
        return {
          id: uid,
          type: ElementType.ADDRESS,
          gridSize: getGridSize(currentItem),
          config: defaultAddressConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'street',
            },
            {
              id: uuidv4(),
              name: 'ward',
            },
            {
              id: uuidv4(),
              name: 'district',
            },
            {
              id: uuidv4(),
              name: 'city',
            },
          ],
        };
      case ElementType.DROPDOWN:
        return {
          id: uid,
          type: ElementType.DROPDOWN,
          gridSize: getGridSize(currentItem),
          config: defaultDropdownConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'dropdown',
            },
          ],
        };
      case ElementType.SINGLE_CHOICE:
        return {
          id: uid,
          type: ElementType.SINGLE_CHOICE,
          gridSize: getGridSize(currentItem),
          config: defaultSingleChoiceConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'singleChoice',
            },
          ],
        };
      case ElementType.MULTIPLE_CHOICE:
        return {
          id: uid,
          type: ElementType.MULTIPLE_CHOICE,
          gridSize: getGridSize(currentItem),
          config: defaultMultipleChoiceConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'multipleChoice',
            },
          ],
        };
      case ElementType.PHONE:
        return {
          id: uid,
          type: ElementType.PHONE,
          gridSize: getGridSize(currentItem),
          config: defaultNumberPhoneConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'phoneNumber',
            },
          ],
        };
      case ElementType.DATEPICKER:
        return {
          id: uid,
          type: ElementType.DATEPICKER,
          gridSize: getGridSize(currentItem),
          config: defaultDatePickerConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'longText',
            },
          ],
        };
      case ElementType.TIME:
        return {
          id: uid,
          type: ElementType.TIME,
          gridSize: getGridSize(currentItem),
          config: defaultTimeInputConfig,
          fields: [
            {
              id: uuidv4(),
              name: 'timeInput',
            },
          ],
        };
      default:
        return undefined;
    }
  };

  const onDrop = (layout: Layout[]) => {
    let currentItem = [...layout].pop();
    const defaultWidthHeight = getDefaultWidthHeight(currentElementType);
    if (!currentItem) return;
    currentItem = {
      ...currentItem,
      i: uuidv4(),
      ...defaultWidthHeight,
    };
    const updatedLayouts = { ...layouts, md: layout };
    setLayouts(updatedLayouts);
    const updatedElements = getElement(elements, layout);
    const createdItem = createItem(currentElementType, currentItem!)!;
    setElements([...updatedElements, createdItem]);
    setEdittingItem(createdItem);
  };

  const handleDragStart = (_layout: Layout[], currentItem: Layout) => {
    setEdittingItem(elements.find((element) => element.id === currentItem.i));
  };

  const handleDragStop = (layout: Layout[], currentItem: Layout) => {
    setElements(getElement(elements, layout));
    setEdittingItem(
      getElement(elements, layout).find(
        (element) => element.id === currentItem.i,
      ),
    );
  };
  useEffect(() => {
    if (form) {
      setElements(form.elements as ElementItem[]);
    }
  }, [isEditForm, form, setElements]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='w-full rounded-md border border-solid border-slate-200 bg-white px-9 py-7'>
      <ResponsiveReactGridLayout
        className={cn('min-h-[200px]', {
          'rounded-md border-2 border-dashed border-slate-300 bg-slate-100':
            elements.length < 1,
        })}
        width={120}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={30}
        layouts={layouts}
        onDrop={onDrop}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        isResizable={false}
        isDroppable={!isDisabled}
        isDraggable={!isDisabled}
        isBounded={true}
        containerPadding={[0, 0]}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        droppingItem={{
          i: FLEETING_INDEX,
          ...getDefaultWidthHeight(currentElementType),
        }}
      >
        {elements.map((element) => (
          <Box
            key={element.id}
            data-grid={element.gridSize}
            className={cn(
              'flex w-full cursor-move flex-col justify-center rounded-md border-[3px] border-solid border-transparent bg-white px-2',
              {
                'react-draggable-dragging border-[3px] border-blue-500 !will-change-auto':
                  element.id === edittingItem?.id,
              },
            )}
          >
            <FactoryElement
              item={element}
              removeItem={() => removeItem(element.id)}
              isActive={element.id === edittingItem?.id}
              updateItem={updateItem}
              handleConfig={handleConfig}
              handleOnChangeAnswer={() => () => {}}
            />
            {element.id === edittingItem?.id && (
              <InteractiveIcons removeItem={removeItem} />
            )}
          </Box>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};
