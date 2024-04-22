import { API_URL } from '@/constants/apiURL';
import {
  FormRequest,
  FormResponse,
  GetFormsParams,
  GetFormsResponse,
  SuccessResponse,
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
    addToFavourites: build.mutation<SuccessResponse<unknown>, { id: number }>({
      query: ({ id }) => ({
        url: `${API_URL.FORMS}/${id}/favourites`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    deleteForm: build.mutation<SuccessResponse<unknown>, { id: number }>({
      query: ({ id }) => ({
        url: `${API_URL.FORMS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Forms'],
    }),
    restoreForm: build.mutation<SuccessResponse<unknown>, { id: number }>({
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
      { id: number; data: FormRequest }
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
      { formId: number; folderId: number }
    >({
      query: ({ formId, folderId }) => ({
        url: `${API_URL.FORMS}/${formId}/folder/${folderId}/add`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    moveToTeam: build.mutation<
      SuccessResponse<unknown>,
      { formId: number; teamId: number }
    >({
      query: ({ formId, teamId }) => ({
        url: `${API_URL.FORMS}/${formId}/team/${teamId}/add`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    removeFromFolder: build.mutation<
      SuccessResponse<unknown>,
      { formId: number; folderId: number }
    >({
      query: ({ formId, folderId }) => ({
        url: `${API_URL.FORMS}/${formId}/folder/${folderId}/remove`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    removeFromTeam: build.mutation<
      SuccessResponse<unknown>,
      { formId: number; teamId: number }
    >({
      query: ({ formId, teamId }) => ({
        url: `${API_URL.FORMS}/${formId}/team/${teamId}/remove`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
    createFormInFolder: build.mutation<
      SuccessResponse<FormResponse>,
      { folderId: number; data: FormRequest }
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
      { teamId: number; data: FormRequest }
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
      { folderId: number; teamId: number; data: FormRequest }
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
      { formId: number; disabled: boolean }
    >({
      query: ({ formId, disabled }) => ({
        url: `${API_URL.FORMS}/${formId}/disabled/${disabled}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Forms'],
    }),
  }),
  overrideExisting: false,
});

export const {
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
} = formApi;
