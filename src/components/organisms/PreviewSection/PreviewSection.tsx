import { useState } from 'react';
import { Box, Stack } from '@mantine/core';
import { Form, Formik } from 'formik';

import { useBuildFormContext } from '@/contexts';

import { FormRenderComponent } from '../FormRenderComponent';
import { SubmissionConfirmation } from '../SubmissionConfirmation';

export const PreviewSection = () => {
  const { form } = useBuildFormContext();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return (
    <Stack className='relative flex h-screen w-full items-center justify-center overflow-y-scroll bg-malachite-50'>
      {isSuccess ? (
        <Box className='scale-90'>
          <SubmissionConfirmation />
        </Box>
      ) : (
        <Box className='absolute top-[50px] w-full py-7'>
          <Formik
            validateOnBlur={true}
            validateOnChange={false}
            initialValues={{}}
            onSubmit={(values) => {
              setIsSuccess(!!values);
            }}
          >
            <Form>
              <FormRenderComponent form={form} />
            </Form>
          </Formik>
        </Box>
      )}
    </Stack>
  );
};
