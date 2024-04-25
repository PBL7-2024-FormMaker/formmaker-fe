import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Button } from '@/atoms/Button';
import {
  ForgotPasswordForm,
  ForgotPasswordSchema,
} from '@/organisms/ForgotPasswordForm';
import { useForgotPasswordUserMutation } from '@/redux/api/authenticationApi';
import { ErrorResponse } from '@/types';
import { toastify } from '@/utils';

import { BIG_Z_INDEX, PATH } from '../../constants';

export const ForgotPasswordPage = () => {
  const [forgotPasswordUser] = useForgotPasswordUserMutation();
  const [visible, { open, close }] = useDisclosure(false);
  const [isSentMail, setIsSentMail] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (values: ForgotPasswordSchema) => {
    open();
    forgotPasswordUser(values).then((res) => {
      if ('data' in res) {
        setIsSentMail(true);
        close();
        return;
      }
      if (res.error as ErrorResponse) {
        toastify.displayError((res.error as ErrorResponse).message);
      }
    });
  };
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center '>
      {isSentMail ? (
        <>
          <Stack className='items-center'>
            <Text className='text-xl font-bold'>Check your email</Text>
            <Text>
              Password reset instructions have been sent successfully via email.
            </Text>
            <Text>
              If you don’t get the email, please check your spam folder.
            </Text>
            <Button
              title='OK'
              className='mt-3 w-full'
              size='lg'
              onClick={() => navigate(PATH.ROOT_PAGE)}
            />
          </Stack>
        </>
      ) : (
        <>
          <div className='relative w-[500px] rounded border bg-white px-6 py-5 shadow-[0px_0px_15px_rgba(0,0,0,0.2)]'>
            <LoadingOverlay
              visible={visible}
              zIndex={BIG_Z_INDEX}
              overlayProps={{ radius: 'sm', blur: 2 }}
              loaderProps={{ color: 'blue' }}
            />
            <div className='flex justify-center'>
              <Text className='mb-5 text-2xl font-bold'>Forgot pasword?</Text>
            </div>
            <ForgotPasswordForm onSubmit={onSubmit} />
          </div>
        </>
      )}
    </div>
  );
};
