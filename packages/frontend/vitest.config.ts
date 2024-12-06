import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['node_modules', 'tests'], // tests for Playwright
    environment: 'jsdom',
    pool: 'vmThreads',
    sequence: {
      setupFiles: 'list',
    },
    globals: true,
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
