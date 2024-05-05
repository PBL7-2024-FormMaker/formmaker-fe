import { useState } from 'react';
import { Box } from '@mantine/core';
import { Form, Formik } from 'formik';

import { useBuildFormContext } from '@/contexts';
import { ScrollToTopButton } from '@/molecules/ScrollToTopButton';
import { ElementType } from '@/types';

import { BuildFormLeftbar } from '../BuildFormLeftbar';
import { FormContainer } from '../FormContainer';

const SHRINK_BUILD_FORM_LEFT_BAR = 0;
const STRETCH_BUILD_FORM_LEFT_BAR = 3;

const SHRINK_FORM_CONTAINER = 1;
const STRETCH_FORM_CONTAINER = 9;

export const BuildSection = () => {
  const { toggledLeftbar } = useBuildFormContext();

  const [currentElementType, setCurrentElementType] = useState<ElementType>();

  return (
    <Formik
      initialValues={{}}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={() => {}}
    >
      <Form className='h-full w-full'>
        <Box className='relative flex h-full w-full bg-navy-10'>
          <Box
            flex={
              toggledLeftbar
                ? STRETCH_BUILD_FORM_LEFT_BAR
                : SHRINK_BUILD_FORM_LEFT_BAR
            }
            className='z-[100] transition-all duration-200 ease-linear'
          >
            <BuildFormLeftbar setCurrentElementType={setCurrentElementType} />
          </Box>
          <Box
            flex={
              toggledLeftbar ? STRETCH_FORM_CONTAINER : SHRINK_FORM_CONTAINER
            }
            className='transition-all duration-200 ease-linear'
          >
            <FormContainer currentElementType={currentElementType!} />
            <ScrollToTopButton className='fixed bottom-14 right-10'></ScrollToTopButton>
          </Box>
        </Box>
      </Form>
    </Formik>
  );
};
