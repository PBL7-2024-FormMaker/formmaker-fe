import { API_URL } from '@/constants/apiURL';
import {
  ChangePasswordPayload,
  SuccessResponse,
  UpdateProfilePayload,
  UserProfileResponse,
} from '@/types';

import { rootApi } from './rootApi';

const userApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getMyProfile: build.query<UserProfileResponse | undefined, void>({
      query: () => ({
        url: API_URL.USER_PROFILE,
        method: 'GET',
      }),
      transformResponse: (response: SuccessResponse<UserProfileResponse>) =>
        response.data,
      providesTags: ['Profile'],
    }),

    updateProfile: build.mutation<
      SuccessResponse<unknown>,
      UpdateProfilePayload
    >({
      query: (payload) => ({
        url: API_URL.USER_PROFILE,
        method: 'PATCH',
        data: payload,
      }),
      invalidatesTags: ['Profile'],
    }),

    changePassword: build.mutation<
      SuccessResponse<unknown>,
      ChangePasswordPayload
    >({
      query: (payload) => ({
        url: API_URL.CHANGE_PASSWORD,
        method: 'PATCH',
        data: payload,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;
