import { Link } from 'react-router-dom';
import { Center, NavLink, Text } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';

import { Button } from '@/atoms/Button';
import { PATH } from '@/constants/routes';
import { PasswordInput } from '@/molecules/PasswordInput';
import { TextInput } from '@/molecules/TextInput';
import { signUpSchema } from '@/utils/schemas/signUpSchema';

export const loginSchema = signUpSchema.pick(['email', 'password']);

export type LoginSchema = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (value: LoginSchema) => void;
}

export const LoginForm = (props: LoginFormProps) => {
  const { onSubmit } = props;
  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      <Form className='h-full w-full'>
        <Field
          classNameWrapper='mb-3 min-h-[88px]'
          name='email'
          label='Email'
          classNameError='min-h-0'
          component={TextInput}
        />

        <Field
          classNameWrapper='mb-3 min-h-[88px]'
          name='password'
          label='Password'
          classNameError='min-h-0'
          component={PasswordInput}
        />

        <div className='flex justify-end'>
          <NavLink
            href='/forgot-password'
            label={<Text size='xs'>Forgot password?</Text>}
            classNames={{
              root: 'max-w-[140px] hover:bg-white hover:text-navy-600 duration-300',
            }}
          />
        </div>

        <Center className='py-2'>
          <Button title='Login' type='submit' className='w-full' />
        </Center>
        <div className='mt-3 flex items-center justify-center text-xs'>
          <span>Don't have an account?</span>
          <Link
            to={PATH.SIGNUP_PAGE}
            className='ml-1 w-[50px] text-navy-500 no-underline hover:font-medium hover:text-navy-800'
          >
            Sign Up
          </Link>
        </div>
      </Form>
    </Formik>
  );
};
