import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react()],
    ...(process.env.PORT && {
      server: {
        port: Number.parseInt(process.env.PORT),
        allowedHosts: ['altinn.lokalt.no'], // Add the allowed host here
      },
    }),
  });
};
