import { useState } from 'react';
import { Box, Stack } from '@mantine/core';
import { Form, Formik } from 'formik';

import { useBuildFormContext } from '@/contexts';
import { ScrollToTopButton } from '@/molecules/ScrollToTopButton';

import { FormRenderComponent } from '../FormRenderComponent';
import { SubmissionConfirmation } from '../SubmissionConfirmation';

export const PreviewSection = () => {
  const { form } = useBuildFormContext();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return (
    <Stack className='relative flex min-h-screen w-full items-center justify-center bg-navy-10'>
      {isSuccess ? (
        <Box className='scale-90'>
          <SubmissionConfirmation />
        </Box>
      ) : (
        <Box className='h-full w-full py-7'>
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
      <ScrollToTopButton className='fixed bottom-[-25%] right-10'></ScrollToTopButton>
    </Stack>
  );
};
