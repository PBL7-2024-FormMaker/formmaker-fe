import { API_URL } from '@/constants/apiURL';
import { ForgotPasswordSchema } from '@/organisms/ForgotPasswordForm';
import { LoginSchema } from '@/organisms/LoginForm';
import { SignupSchema } from '@/organisms/SignupForm';
import { AuthResponse, SuccessResponse } from '@/types';

import { ResetPasswordSchema } from '../../../components/organisms/ResetPasswordForm';

import { rootApi } from './rootApi';

export const authenticationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation<SuccessResponse<AuthResponse>, LoginSchema>({
      query: (data: LoginSchema) => ({
        url: API_URL.LOGIN,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Profile', 'Forms', 'Folders', 'Teams', 'Responses'],
    }),
    signUpUser: build.mutation<
      SuccessResponse<AuthResponse>,
      Omit<SignupSchema, 'confirmPassword'>
    >({
      query: (data: Omit<SignupSchema, 'confirmPassword'>) => ({
        url: API_URL.SIGN_UP,
        method: 'POST',
        data,
      }),
    }),
    forgotPasswordUser: build.mutation<
      SuccessResponse<AuthResponse>,
      ForgotPasswordSchema
    >({
      query: (data: ForgotPasswordSchema) => ({
        url: API_URL.FORGOT_PASSWORD,
        method: 'POST',
        data,
      }),
    }),
    resetPasswordUser: build.mutation<
      SuccessResponse<AuthResponse>,
      Omit<ResetPasswordSchema, 'confirmPassword'>
    >({
      query: (data: Omit<ResetPasswordSchema, 'confirmPassword'>) => ({
        url: API_URL.RESET_PASSWORD,
        method: 'POST',
        data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginUserMutation,
  useSignUpUserMutation,
  useForgotPasswordUserMutation,
  useResetPasswordUserMutation,
} = authenticationApi;
