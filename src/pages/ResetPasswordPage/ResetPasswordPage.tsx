import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingOverlay, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { BIG_Z_INDEX, PATH } from '@/constants';
import {
  ResetPasswordForm,
  ResetPasswordSchema,
} from '@/organisms/ResetPasswordForm';
import { useResetPasswordUserMutation } from '@/redux/api/authenticationApi';
import { ErrorResponse } from '@/types';
import { httpClient, saveAccessTokenToLS, toastify } from '@/utils';

export const ResetPasswordPage = () => {
  const params = useLocation();
  const navigate = useNavigate();
  const [resetPasswordUser] = useResetPasswordUserMutation();
  const [visible, { open, close }] = useDisclosure(false);

  const onSubmit = (values: ResetPasswordSchema) => {
    open();
    const token = new URLSearchParams(params.search).get('token');
    httpClient.setToken(token!);
    saveAccessTokenToLS(token!);
    resetPasswordUser(values).then((res) => {
      if ('data' in res) {
        close();
        navigate(PATH.ROOT_PAGE);
        return;
      }
      if (res.error as ErrorResponse) {
        toastify.displayError((res.error as ErrorResponse).message);
        close();
      }
    });
  };

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center '>
      <div className='relative w-[500px] rounded border bg-white px-6 py-5 shadow-[0px_0px_15px_rgba(0,0,0,0.2)]'>
        <LoadingOverlay
          visible={visible}
          zIndex={BIG_Z_INDEX}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue' }}
        />
        <div className='flex flex-col items-center justify-center'>
          <Text className='text-2xl font-bold'>Reset Password</Text>
          <Text className='mb-5'>
            You can reset your password using this form.
          </Text>
          <ResetPasswordForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};
