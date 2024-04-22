import { ReactNode } from 'react';

import { Toast } from '@/atoms/Toast';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <>
    {children}
    <Toast />
  </>
);
