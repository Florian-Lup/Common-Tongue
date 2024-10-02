import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_WORDWARE_API_KEY': JSON.stringify(process.env.VITE_WORDWARE_API_KEY),
    'process.env.VITE_WORDWARE_API_URL': JSON.stringify(process.env.VITE_WORDWARE_API_URL),
  },
});