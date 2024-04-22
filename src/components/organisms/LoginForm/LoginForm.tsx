import { Link } from 'react-router-dom';
import { Center } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';

import { Button } from '@/atoms/Button';
import { PATH } from '@/constants/routes';
import { PasswordInput } from '@/molecules/PasswordInput';
import { TextInput } from '@/molecules/TextInput';
import { signUpSchema } from '@/utils/schemas/signUpSchema';

const loginSchema = signUpSchema.pick(['email', 'password']);

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
          classNameWrapper='mb-3'
          name='email'
          label='Email'
          classNameError='min-h-0'
          component={TextInput}
        />

        <Field
          classNameWrapper='mb-3'
          name='password'
          label='Password'
          classNameError='min-h-0'
          component={PasswordInput}
        />

        <Center className='py-2'>
          <Button title='Login' type='submit' className='w-full' />
        </Center>
        <div className='mt-3 flex items-center justify-center text-xs'>
          <span>Don't have an account?</span>
          <Link
            to={PATH.SIGNUP_PAGE}
            className='ml-1 text-malachite-500 no-underline hover:font-medium hover:text-malachite-600'
          >
            Sign Up
          </Link>
        </div>
      </Form>
    </Formik>
  );
};
