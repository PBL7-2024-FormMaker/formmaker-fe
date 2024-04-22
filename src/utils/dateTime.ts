import dayjs from 'dayjs';

export const formatDate = (
  value: string | number | Date | dayjs.Dayjs,
  format = 'DD/MM/YYYY',
) => {
  if (!value) return '';
  return dayjs(value).format(format);
};
