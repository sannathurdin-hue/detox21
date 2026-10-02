import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Bygger statiskt till ../matguide så att sajten (Netlify publish ".") serverar den på /matguide/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '../matguide', emptyOutDir: true, chunkSizeWarningLimit: 1200 },
  test: { environment: 'jsdom' },
});
