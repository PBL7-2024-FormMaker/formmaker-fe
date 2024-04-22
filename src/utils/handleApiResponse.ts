import { SuccessResponse } from '@/types';

export const countSuccessAndErrors = (
  response: PromiseSettledResult<
    | {
        data: SuccessResponse<unknown>;
      }
    | {
        error: unknown;
      }
  >[],
) => {
  const { successCount, errorCount } = response.reduce<{
    successCount: number;
    errorCount: number;
  }>(
    (acc, res) => {
      if (res.status === 'fulfilled' && 'data' in res.value) {
        acc.successCount += 1;
        return acc;
      }
      acc.errorCount += 1;
      return acc;
    },
    { successCount: 0, errorCount: 0 },
  );
  return { successCount, errorCount };
};
