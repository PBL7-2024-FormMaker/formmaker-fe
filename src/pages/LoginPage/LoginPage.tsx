import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Image,
  LoadingOverlay,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import BlueLogo from '@/assets/images/bluelogo.png';
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
    <div className='flex h-screen w-screen flex-row'>
      <div className='bg-navy-10 flex h-full w-1/2 flex-col items-center justify-evenly'>
        <Anchor href={PATH.ROOT_PAGE} className='w-[500px]'>
          <Image src={BlueLogo} className='h-full' />
        </Anchor>
        <div className='flex h-[600px] flex-col gap-6'>
          <span className='w-[400px] text-lg'>
            Welcome back! Please login to your account
          </span>
          <div className='relative w-[500px] rounded border bg-white px-6 py-5 shadow-[0px_0px_15px_rgba(0,0,0,0.2)]'>
            <LoadingOverlay
              visible={visible}
              zIndex={BIG_Z_INDEX}
              overlayProps={{ radius: 'sm', blur: 2 }}
              loaderProps={{ color: 'blue' }}
            />
            <LoginForm onSubmit={onSubmit} />
          </div>
          <div className='flex justify-between'>
            Or login with
            <UnstyledButton className='text-navy-300 hover:text-navy-600 hover:font-medium'>
              Facebook
            </UnstyledButton>
            <UnstyledButton className='text-navy-300 hover:text-navy-600 hover:font-medium'>
              Google
            </UnstyledButton>
          </div>
        </div>
      </div>
      <div className='flex h-contentHeight w-1/2 flex-col justify-center gap-7'>
        <div className='flex flex-col items-center justify-between gap-2 text-center'>
          <div className='w-[80%]'>
            <Text className='text-3xl font-bold'>
              EASIEST ONLINE FORM BUILDER
            </Text>
            <Text className='text-navy-50 mt-4 text-lg font-semibold'>
              We believe the right form makes all the difference. Go from
              busywork to less work with powerful forms that use conditional
              logic, accept payments, generate reports, and automate workflows
            </Text>
          </div>
          <Image
            className='w-[700px] object-contain'
            src='./images/background_login_page.png'
          />
        </div>
      </div>
    </div>
  );
};
