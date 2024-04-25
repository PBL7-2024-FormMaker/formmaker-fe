import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { NavLink } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';

import { Button } from '../../atoms/Button';
import { TextInput } from '../../molecules/TextInput';
import { loginSchema } from '../LoginForm';

export const forgotPasswordSchema = loginSchema.pick(['email']);

export type ForgotPasswordSchema = yup.InferType<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (value: ForgotPasswordSchema) => void;
}
export const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { onSubmit } = props;
  const initialValues = {
    email: '',
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      <Form className='w-full'>
        <Field
          classNameWrapper='mb-3'
          name='email'
          label='Type your email'
          classNameError='min-h-0'
          component={TextInput}
        />
        <Button
          title='Send reset password to email'
          type='submit'
          className='my-3 w-full'
          size='lg'
        />
        <NavLink
          className='w-[120px]'
          label='Go back'
          href='/login'
          leftSection={<IoArrowBackCircleSharp />}
        />
      </Form>
    </Formik>
  );
};
