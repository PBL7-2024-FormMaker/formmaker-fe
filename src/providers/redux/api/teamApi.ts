import { API_URL } from '@/constants/apiURL';
import { SuccessResponse, TeamResponse, TeamResquest } from '@/types';

import { rootApi } from './rootApi';

const teamApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getMyTeams: build.query<TeamResponse[], void>({
      query: () => ({
        url: API_URL.TEAMS,
        method: 'GET',
      }),
      transformResponse: (response: SuccessResponse<TeamResponse[]>) =>
        response.data,
      providesTags: ['Teams'],
    }),
    getTeamDetails: build.query<TeamResponse, { id: number }>({
      query: ({ id }) => ({
        url: `${API_URL.TEAMS}/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: SuccessResponse<TeamResponse>) =>
        response.data,
      providesTags: (_result, _error, arg) => [{ type: 'Teams', id: arg.id }],
    }),
    createTeam: build.mutation<SuccessResponse<TeamResponse>, TeamResquest>({
      query: (data) => ({
        url: API_URL.TEAMS,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Teams'],
    }),
    updateTeam: build.mutation<
      SuccessResponse<TeamResponse>,
      { id: number; data: TeamResquest }
    >({
      query: ({ id, data }) => ({
        url: `${API_URL.TEAMS}/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Teams'],
    }),
    deleteTeam: build.mutation<SuccessResponse<TeamResponse>, { id: number }>({
      query: ({ id }) => ({
        url: `${API_URL.TEAMS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teams'],
    }),
    addMember: build.mutation<
      SuccessResponse<TeamResponse>,
      { id: number; email: string }
    >({
      query: ({ id, email }) => ({
        url: `${API_URL.TEAMS}/${id}/add-member`,
        method: 'PATCH',
        data: { email },
      }),
      invalidatesTags: ['Teams'],
    }),
    removeMember: build.mutation<
      SuccessResponse<TeamResponse>,
      { id: number; memberIds: number[] }
    >({
      query: ({ id, memberIds }) => ({
        url: `${API_URL.TEAMS}/${id}/remove-member`,
        method: 'PATCH',
        data: { memberIds },
      }),
      invalidatesTags: ['Teams'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyTeamsQuery,
  useGetTeamDetailsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = teamApi;
