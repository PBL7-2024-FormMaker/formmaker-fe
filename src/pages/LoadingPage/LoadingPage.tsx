import { LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export const LoadingPage = () => {
  const [visible] = useDisclosure(true);
  return (
    <LoadingOverlay
      visible={visible}
      zIndex={1000}
      loaderProps={{ color: 'green' }}
      overlayProps={{ radius: 'sm', blur: 2 }}
    />
  );
};
