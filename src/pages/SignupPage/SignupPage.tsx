import { useNavigate } from 'react-router-dom';
import { Anchor, Image, LoadingOverlay, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import BlueLogo from '@/assets/images/bluelogo.png';
import { BIG_Z_INDEX } from '@/constants';
import { PATH } from '@/constants/routes';
import { SignupForm, SignupSchema } from '@/organisms/SignupForm';
import { useSignUpUserMutation } from '@/redux/api/authenticationApi';
import { ErrorResponse } from '@/types';
import { httpClient, saveAccessTokenToLS, toastify } from '@/utils';

export const SignupPage = () => {
  const [signUpUser] = useSignUpUserMutation();
  const [visible, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const acceptUrl = localStorage.getItem('acceptUrl');

  const onSubmit = (values: SignupSchema) => {
    const { username, email, password } = values;
    open();
    signUpUser({ username, email, password }).then((res) => {
      if ('data' in res) {
        httpClient.setToken(res.data.data.token);
        saveAccessTokenToLS(res.data.data.token);
        close();
        acceptUrl ? navigate(`${acceptUrl}`) : navigate(PATH.ROOT_PAGE);
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
      <div className='flex h-full w-1/2 flex-col items-center justify-evenly bg-navy-10'>
        <Anchor href={PATH.ROOT_PAGE} className='w-[500px]'>
          <Image src={BlueLogo} className='h-full' />
        </Anchor>
        <div className='flex h-[600px] flex-col gap-6'>
          <span className='w-[400px] text-lg'>
            Get started by creating your account
          </span>
          <div className='relative w-[500px] rounded border bg-white px-6 py-5 shadow-[0px_0px_15px_rgba(0,0,0,0.2)]'>
            <LoadingOverlay
              visible={visible}
              zIndex={BIG_Z_INDEX}
              overlayProps={{ radius: 'sm', blur: 2 }}
              loaderProps={{ color: 'blue' }}
            />
            <SignupForm onSubmit={onSubmit} />
          </div>
          {/* <div className='flex justify-between'>
            Or sign up with
            <UnstyledButton className='text-navy-300 hover:font-medium hover:text-navy-600'>
              Facebook
            </UnstyledButton>
            <UnstyledButton className='text-navy-300 hover:font-medium hover:text-navy-600'>
              Google
            </UnstyledButton>
          </div> */}
        </div>
      </div>
      <div className='flex h-contentHeight w-1/2 flex-col justify-center gap-7'>
        <div className='flex flex-col items-center justify-between gap-2 text-center'>
          <div className='w-[80%]'>
            <Text className='text-3xl font-bold'>
              SIMPLEST ONLINE FORM MAKER
            </Text>
            <Text className='mt-4 text-lg font-semibold text-navy-50'>
              Say goodbye to boring tasks and welcome streamlined efficiency
              with our advanced form maker. Experience the power of
              drag-and-drop simplicity and automated form generation,
              simplifying your online form-building journey like never before
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
