import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Use React integration
  integrations: [react()],
  // Integrate Vite plugins (Tailwind V4 uses Vite plugin)
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'https://cryptocurrency.cv',
          changeOrigin: true,
        }
      }
    }
  },
  // SSG mode output
  output: 'static',
});
