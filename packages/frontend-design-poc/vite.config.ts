import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default () => {
	if(process.env.PORT) {
		return defineConfig({
			plugins: [react()],

			server: {
				port: parseInt(process.env.PORT),
			},
		});
	}

	return defineConfig({
		plugins: [react()],
	});
}
