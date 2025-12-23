import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/digital-detective-filed-guide-sample/', // 👈 必须是 仓库名
})