import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
  
        '@assets': path.resolve(__dirname, 'SRC/assets'),
        '@components': path.resolve(__dirname, 'SRC/components'),
        '@utils': path.resolve(__dirname, 'SRC/utils'),
        '@styles': path.resolve(__dirname, 'SRC/styles'),
    
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '') // Uncomment if needed
      },
    },
  },
});