import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: {
          main: './index.html', // Asegúrate de que tu punto de entrada esté correctamente configurado
        }
      }
    }
  };
});