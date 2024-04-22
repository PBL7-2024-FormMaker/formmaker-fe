import { API_URL } from '@/constants/apiURL';
import { FolderRequest, FolderResponse, SuccessResponse } from '@/types';

import { rootApi } from './rootApi';

const folderApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getMyFolders: build.query<FolderResponse[], void>({
      query: () => ({
        url: API_URL.INDEPENDENT_FOLDER,
        method: 'GET',
      }),
      transformResponse: (response: SuccessResponse<FolderResponse[]>) =>
        response.data,
      providesTags: ['Folders'],
    }),
    createFolder: build.mutation<
      SuccessResponse<FolderResponse>,
      {
        teamId?: number;
        payload: FolderRequest;
      }
    >({
      query: ({ teamId = undefined, payload }) => ({
        url: teamId ? `${API_URL.FOLDERS}/team/${teamId}` : API_URL.FOLDERS,
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Folders', 'Teams'],
    }),
    updateFolder: build.mutation<
      SuccessResponse<FolderResponse>,
      { id: number; data: FolderRequest }
    >({
      query: ({ id, data }) => ({
        url: `${API_URL.FOLDERS}/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Folders', 'Teams', 'Forms'],
    }),
    deleteFolder: build.mutation<SuccessResponse<FolderResponse>, number>({
      query: (id) => ({
        url: `${API_URL.FOLDERS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Folders', 'Teams', 'Forms'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyFoldersQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} = folderApi;
