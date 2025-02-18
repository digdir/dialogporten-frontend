import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import pkg from '../../package.json';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react()],
    ...(process.env.PORT && {
      server: {
        port: Number.parseInt(process.env.PORT),
        ...(process.env.ENABLE_HTTPS && { allowedHosts: ['altinn.lokalt.no'] }),
      },
    }),
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
  });
};
