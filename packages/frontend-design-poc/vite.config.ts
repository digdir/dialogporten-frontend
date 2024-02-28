import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react()],
    ...(process.env.PORT && {
      server: {
        port: parseInt(process.env.PORT),
      },
    }),
  });
};
