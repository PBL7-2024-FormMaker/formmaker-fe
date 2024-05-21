import { API_URL } from '@/constants/apiURL';
import { SuccessResponse, UploadImageResponse } from '@/types';

import { rootApi } from './rootApi';

const fileApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<SuccessResponse<UploadImageResponse>, File>({
      query: (file) => {
        const payload = new FormData();
        payload.append('file', file);
        return {
          url: API_URL.UPLOAD_FILE,
          method: 'POST',
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useUploadFileMutation } = fileApi;
