import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Environment variables are automatically loaded from .env by Vite

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  }
});