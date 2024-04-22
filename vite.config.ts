import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('', process.cwd());

const pathResolve = (dir: string) => resolve(__dirname, '.', dir);

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(env.VITE_APP_PORT) || 5173,
  },
  resolve: {
    alias: {
      '@/configs': pathResolve('src/configs'),
      '@/assets': pathResolve('src/assets'),
      '@/utils': pathResolve('src/utils'),
      '@/atoms': pathResolve('src/components/atoms'),
      '@/molecules': pathResolve('src/components/molecules'),
      '@/organisms': pathResolve('src/components/organisms'),
      '@/templates': pathResolve('src/components/templates'),
      '@/pages': pathResolve('src/pages'),
      '@/constants': pathResolve('src/constants'),
      '@/hooks': pathResolve('src/hooks'),
      '@/redux': pathResolve('src/providers/redux'),
      '@/types': pathResolve('src/types'),
      '@/apis': pathResolve('src/apis'),
      '@/contexts': pathResolve('src/contexts'),
    },
  },
  base: '/',
});
