import {
  Loader as MantineLoader,
  LoaderProps as MantineLoaderProps,
  Stack,
} from '@mantine/core';

import { cn } from '@/utils';

interface LoaderProps extends MantineLoaderProps {
  className?: string;
}

export const Loader = (props: LoaderProps) => {
  const { color = 'green', type = 'dots', className, ...rest } = props;
  return (
    <Stack className={cn('items-center justify-center', className)}>
      <MantineLoader color={color} type={type} {...rest} />
    </Stack>
  );
};
