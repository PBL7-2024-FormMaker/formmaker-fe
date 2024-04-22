import { useNavigate } from 'react-router-dom';
import { Image, LoadingOverlay, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { UnSignedHeader } from '@/atoms/UnsignedHeader';
import { BIG_Z_INDEX } from '@/constants';
import { PATH } from '@/constants/routes';
import { LoginForm, LoginSchema } from '@/organisms/LoginForm';
import { useLoginUserMutation } from '@/redux/api/authenticationApi';
import { ErrorResponse } from '@/types';
import { httpClient, saveAccessTokenToLS, toastify } from '@/utils';

export const LoginPage = () => {
  const [loginUser] = useLoginUserMutation();
  const [visible, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const onSubmit = (values: LoginSchema) => {
    open();
    loginUser(values).then((res) => {
      if ('data' in res) {
        httpClient.setToken(res.data.data.token);
        saveAccessTokenToLS(res.data.data.token);
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
    <div className='h-screen w-screen'>
      <div className='h-headerHeight bg-malachite-500 px-4 pt-4'>
        <UnSignedHeader />
      </div>
      <div className='flex h-contentHeight flex-col justify-center gap-7'>
        <div className='flex flex-col justify-between gap-2 text-center'>
          <Text className='text-xl font-bold text-malachite-400'>
            EASIEST ONLINE FORM BUILDER
          </Text>
          <Text className='text-5xl font-bold'>
            Powerful forms get it done.
          </Text>
        </div>
        <div className='flex h-[405px] items-center justify-evenly'>
          <div className='mt-3'>
            <Image
              className='h-64 w-80 object-contain'
              src='./images/girl.jpeg'
            />
          </div>
          <div className='relative w-[400px] rounded border bg-white px-6 py-5 shadow-[0px_0px_15px_rgba(0,0,0,0.2)]'>
            <LoadingOverlay
              visible={visible}
              zIndex={BIG_Z_INDEX}
              overlayProps={{ radius: 'sm', blur: 2 }}
              loaderProps={{ color: 'green' }}
            />
            <LoginForm onSubmit={onSubmit} />
          </div>
          <div>
            <Image
              className='h-72 w-80 object-contain'
              src='./images/girl2.jpeg'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
