import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html', // Asegúrate de que tu punto de entrada esté correctamente configurado
      }
    }
  }
});