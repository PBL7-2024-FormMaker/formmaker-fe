import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { NavLink } from '@mantine/core';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';

import { Button } from '@/atoms/Button';
import { PasswordInput } from '@/molecules/PasswordInput';

import { signUpSchema } from '../../../utils';

export const resetPasswordSchema = signUpSchema.pick([
  'password',
  'confirmPassword',
]);

export type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmit: (value: ResetPasswordSchema) => void;
}
export const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const { onSubmit } = props;
  const initialValues = {
    password: '',
    confirmPassword: '',
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      <Form className='w-full'>
        <Field
          classNameWrapper='mb-3'
          name='password'
          label='Type your new password'
          classNameError='min-h-0'
          component={PasswordInput}
        />
        <Field
          classNameWrapper='mb-3'
          name='confirmPassword'
          label='Confirm your password'
          classNameError='min-h-0'
          component={PasswordInput}
        />
        <Button
          title='Submit'
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
