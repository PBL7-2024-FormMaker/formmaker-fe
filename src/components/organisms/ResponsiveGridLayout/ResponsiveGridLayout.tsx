import { useEffect, useRef, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import { Box } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';

import { useBuildFormContext, useElementLayouts } from '@/contexts';
import { FactoryElement } from '@/molecules/FactoryElement';
import { InteractiveIcons } from '@/molecules/InteractiveIcons';
import { useGetFormDetailsQuery } from '@/redux/api/formApi';
import { ElementItem, ElementType } from '@/types';
import { cn } from '@/utils';
import { createItem, getDefaultWidthHeight } from '@/utils/elements';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface ResponsiveGridLayoutProps {
  currentElementType: ElementType;
  updateItem: (item: ElementItem) => void;
  handleConfig: (config: ElementItem['config']) => void;
}

const FLEETING_INDEX = 'fleeting';

export const ResponsiveGridLayout = ({
  currentElementType,
  updateItem,
  handleConfig,
}: ResponsiveGridLayoutProps) => {
  const {
    elements,
    setElements,
    edittingItem,
    setEdittingItem,
    isScrollToBottom,
    setIsScrollToBottom,
  } = useElementLayouts();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [layouts, setLayouts] = useState<{
    lg: Layout[];
    md: Layout[];
    sm: Layout[];
    xs: Layout[];
    xxs: Layout[];
  }>({ lg: [], md: [], sm: [], xs: [], xxs: [] });
  const elmsInForm = useRef<null | HTMLDivElement>(null);
  const { isEditForm, setToggledRightbar, setCanUpdateForm } =
    useBuildFormContext();
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
    setCanUpdateForm(true);
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
    setCanUpdateForm(true);
  };

  const handleDragStart = (_layout: Layout[], currentItem: Layout) => {
    setTime(Date.now());
    setEdittingItem(elements.find((element) => element.id === currentItem.i));
    setCanUpdateForm(false);
  };

  const handleDragStop = (layout: Layout[], currentItem: Layout) => {
    const canUpdateElements = (Date.now() - time) / 1000 > 0.5;
    if (canUpdateElements) {
      setElements(getElement(elements, layout));
      setEdittingItem(
        getElement(elements, layout).find(
          (element) => element.id === currentItem.i,
        ),
      );
      setCanUpdateForm(true);
    } else {
      setCanUpdateForm(false);
    }
  };
  useEffect(() => {
    if (form) {
      setElements(form.elements as ElementItem[]);
      setCanUpdateForm(false);
    }
  }, [isEditForm, form, setElements]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isScrollToBottom) {
      elmsInForm.current?.scrollIntoView({
        behavior: 'smooth',
      });
      setIsScrollToBottom(false);
    }
  }, [isScrollToBottom]);

  return (
    <div className='mb-[50px] w-full rounded-md border border-solid border-slate-200 bg-white py-7 pl-9 pr-[54px]'>
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
        isDroppable={true}
        isDraggable={true}
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
            onClick={(e) => {
              e.stopPropagation();
              setToggledRightbar(true);
            }}
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
      <div ref={elmsInForm}></div>
    </div>
  );
};
