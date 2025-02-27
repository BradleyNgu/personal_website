import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'public', // Ensures index.html is the entry point
  build: {
    outDir: 'dist',
  },
});
