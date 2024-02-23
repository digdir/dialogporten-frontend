import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['node_modules', 'tests'], // tests for Playwright
    environment: "jsdom",
    globals: true,
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  }
})
