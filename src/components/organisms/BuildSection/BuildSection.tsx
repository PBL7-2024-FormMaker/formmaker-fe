import { useState } from 'react';
import { Box } from '@mantine/core';
import { Form, Formik } from 'formik';

import { ElementType } from '@/types';

import { BuildFormLeftbar } from '../BuildFormLeftbar';
import { FormContainer } from '../FormContainer';

const STRETCH_BUILD_FORM_LEFT_BAR = 3;

const STRETCH_FORM_CONTAINER = 9;

export const BuildSection = () => {
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
          <Box flex={STRETCH_BUILD_FORM_LEFT_BAR}>
            <Box className='flex h-mainHeight min-w-[180px] max-w-[226px] flex-col justify-between border-l-[0.5px] border-r-[0.5px] border-gray-300 bg-gray-50 lg:min-w-[270px] lg:max-w-[300px]'>
              <BuildFormLeftbar setCurrentElementType={setCurrentElementType} />
            </Box>
          </Box>
          <Box flex={STRETCH_FORM_CONTAINER} className='overflow-auto'>
            <FormContainer currentElementType={currentElementType!} />
          </Box>
        </Box>
      </Form>
    </Formik>
  );
};
