import { API_URL } from '@/constants';
import { SuccessResponse } from '@/types';
import {
  FormAnswerRequest,
  FormAnswerResponse,
  GetResponsesParams,
  ReturnGetResponses,
} from '@/types/responses';

import { rootApi } from './rootApi';

interface GetResponsesType extends GetResponsesParams {
  formId: number;
}

export const responseApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getResponsesByFormId: build.query({
      query: ({ formId, ...params }: GetResponsesType) => ({
        url: `${API_URL.RESPONSES}/${formId}`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: SuccessResponse<ReturnGetResponses>) =>
        response.data,
      providesTags: ['Responses'],
    }),
    createResponse: build.mutation<
      SuccessResponse<FormAnswerResponse>,
      {
        formId?: number;
        payload: FormAnswerRequest;
      }
    >({
      query: ({ formId = undefined, payload }) => ({
        url: `${API_URL.RESPONSES}/${formId}`,
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['Responses'],
    }),
    deleteOneResponse: build.mutation({
      query: ({
        formId,
        responseId,
      }: {
        formId: number;
        responseId: number;
      }) => ({
        url: `${API_URL.RESPONSES}/${formId}/${responseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Responses'],
    }),
    deleteMultipleResponses: build.mutation({
      query: ({
        formId,
        responsesIds,
      }: {
        formId: number;
        responsesIds: number[];
      }) => ({
        url: `${API_URL.RESPONSES}/${formId}`,
        method: 'DELETE',
        data: { responsesIds: responsesIds },
      }),
      invalidatesTags: ['Responses'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetResponsesByFormIdQuery,
  useCreateResponseMutation,
  useDeleteMultipleResponsesMutation,
  useDeleteOneResponseMutation,
} = responseApi;
