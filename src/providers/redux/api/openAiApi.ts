import { API_URL } from '@/constants';

import { rootApi } from './rootApi';

export const openAiApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getElementsFromQuestion: build.mutation({
      query: ({ questions }: { questions: string }) => ({
        url: `${API_URL.OPEN_AI}/${API_URL.GET_QUESTIONS}`,
        data: { questions: questions },
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetElementsFromQuestionMutation } = openAiApi;
