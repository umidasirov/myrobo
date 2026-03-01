import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // port: 3000,        // Shu yerda portni belgilaymiz
    // open: true,        // Server ishga tushganda brauzer avtomatik ochiladi
  },
});