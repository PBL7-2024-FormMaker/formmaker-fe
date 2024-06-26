import { API_URL } from '@/constants/apiURL';
import {
  FormRequest,
  FormResponse,
  GetFormsParams,
  GetFormsResponse,
  SuccessResponse,
  UserProfileResponse,
} from '@/types';

import { rootApi } from './rootApi';

const formApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getMyForms: build.query<GetFormsResponse, GetFormsParams>({
      query: (params: GetFormsParams) => ({
        url: API_URL.FORMS,
        method: 'GET',
        params,
      }),
      transformResponse: (response: SuccessResponse<GetFormsResponse>) =>
        response.data,
      providesTags: ['Forms', 'Responses'],
    }),
    getFormDetails: build.query<FormResponse, { id: string }>({
      query: ({ id }) => ({
        url: `${API_URL.FORMS}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: SuccessResponse<FormResponse>) =>
        response.data,
      providesTags: (_result, _error, arg) => [{ type: 'Forms', id: arg.id }],
    }),
    getUsersInForm: build.query<UserProfileResponse[], { id: string }>({
      query: ({ id }) => ({
        url: `${API_URL.FORMS}/${id}/members`,
        method: 'GET',
      }),
      transformResponse: (response: SuccessResponse<UserProfileResponse[]>) =>
        response.data,
      providesTags: (_result, _error, arg) => [{ type: 'Forms', id: arg.id }],
    }),
    inviteFormMember: build.mutation<
      SuccessResponse<FormResponse>,
      { id: string; email: string }
    >({
      query: ({ id, email }) => ({
        url: `${API_URL.FORMS}/${id}/invite-member`,
        method: 'POST',
        data: { email },
      }),
      invalidatesTags: ['Forms'],
    }),
    addFormMember: build.mutation<
      SuccessResponse<FormResponse>,
      { id: string; email: string }
    >({
      query: ({ id, email }) => ({
        url: `${API_URL.FORMS}/${id}/add-member`,
        method: 'PATCH',
        data: { email },
      }),
      invalidatesTags: ['Forms'],
    }),
    removeFormMember: build.mutation<
      SuccessResponse<FormResponse>,
      { id: string; memberIds: string[] }
    >({
      query: ({ id, memberIds }) => ({
        url: `${API_URL.FORMS}/${id}/remove-member`,
        method: 'PATCH',
        data: { memberIds },
      }),
      invalidatesTags: ['Forms'],
    }),
    addToFavourites: build.mutation<SuccessResponse<unknown>, { id: string }>({
      query: ({ id }) => ({
        url: `${API_URL.FORMS}/${id}/favourites`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    deleteForm: build.mutation<SuccessResponse<unknown>, { id: string }>({
      query: ({ id }) => ({
        url: `${API_URL.FORMS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Forms'],
    }),
    restoreForm: build.mutation<SuccessResponse<unknown>, { id: string }>({
      query: ({ id }) => ({
        url: `${API_URL.FORMS}/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    createForm: build.mutation<SuccessResponse<FormResponse>, FormRequest>({
      query: (data) => ({
        url: API_URL.FORMS,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Forms'],
    }),
    updateForm: build.mutation<
      SuccessResponse<FormResponse>,
      { id: string; data: FormRequest }
    >({
      query: ({ id, data }) => ({
        url: `${API_URL.FORMS}/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Forms', 'Responses'],
    }),
    addToFolder: build.mutation<
      SuccessResponse<unknown>,
      { formId: string; folderId: string }
    >({
      query: ({ formId, folderId }) => ({
        url: `${API_URL.FORMS}/${formId}/folder/${folderId}/add`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    moveToTeam: build.mutation<
      SuccessResponse<unknown>,
      { formId: string; teamId: string }
    >({
      query: ({ formId, teamId }) => ({
        url: `${API_URL.FORMS}/${formId}/team/${teamId}/add`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    removeFromFolder: build.mutation<
      SuccessResponse<unknown>,
      { formId: string; folderId: string }
    >({
      query: ({ formId, folderId }) => ({
        url: `${API_URL.FORMS}/${formId}/folder/${folderId}/remove`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    removeFromTeam: build.mutation<
      SuccessResponse<unknown>,
      { formId: string; teamId: string }
    >({
      query: ({ formId, teamId }) => ({
        url: `${API_URL.FORMS}/${formId}/team/${teamId}/remove`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    createFormInFolder: build.mutation<
      SuccessResponse<FormResponse>,
      { folderId: string; data: FormRequest }
    >({
      query: ({ folderId, data }) => ({
        url: `${API_URL.FORMS}/folder/${folderId}`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Forms'],
    }),
    createFormInTeam: build.mutation<
      SuccessResponse<FormResponse>,
      { teamId: string; data: FormRequest }
    >({
      query: ({ teamId, data }) => ({
        url: `${API_URL.FORMS}/team/${teamId}`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Forms'],
    }),
    createFormInFolderOfTeam: build.mutation<
      SuccessResponse<FormResponse>,
      { folderId: string; teamId: string; data: FormRequest }
    >({
      query: ({ folderId, teamId, data }) => ({
        url: `${API_URL.FORMS}/folder/${folderId}/team/${teamId}`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Forms'],
    }),
    updateDisabledStatus: build.mutation<
      SuccessResponse<FormResponse>,
      { formId: string; disabled: boolean }
    >({
      query: ({ formId, disabled }) => ({
        url: `${API_URL.FORMS}/${formId}/disabled/${disabled}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    updateDisabledOnspecificDateStatus: build.mutation<
      SuccessResponse<FormResponse>,
      { formId: string; disabledOnSpecificDate: boolean; specificDate: Date }
    >({
      query: ({ formId, disabledOnSpecificDate, specificDate }) => ({
        url: `${API_URL.FORMS}/${formId}/disabled-on-specific-date/${disabledOnSpecificDate}`,
        method: 'PATCH',
        data: { specificDate },
      }),
      invalidatesTags: ['Forms'],
    }),
    updateDisabledNotificationStatus: build.mutation<
      SuccessResponse<FormResponse>,
      { formId: string; disabledNotification: boolean }
    >({
      query: ({ formId, disabledNotification }) => ({
        url: `${API_URL.FORMS}/${formId}/disabled-notification/${disabledNotification}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersInFormQuery,
  useAddFormMemberMutation,
  useInviteFormMemberMutation,
  useRemoveFormMemberMutation,
  useGetMyFormsQuery,
  useGetFormDetailsQuery,
  useAddToFavouritesMutation,
  useDeleteFormMutation,
  useRestoreFormMutation,
  useCreateFormMutation,
  useUpdateFormMutation,
  useAddToFolderMutation,
  useMoveToTeamMutation,
  useRemoveFromFolderMutation,
  useRemoveFromTeamMutation,
  useCreateFormInFolderMutation,
  useCreateFormInTeamMutation,
  useCreateFormInFolderOfTeamMutation,
  useUpdateDisabledStatusMutation,
  useUpdateDisabledOnspecificDateStatusMutation,
  useUpdateDisabledNotificationStatusMutation,
} = formApi;
