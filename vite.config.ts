import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite + Vitest share this config. The SRS scheduling core is pure and runs
// under Node in tests; the UI runs in the browser via `npm run dev`.
export default defineConfig({
  // 部署到 GitHub Pages 项目页：仓库地址带 /ielts-graded-vocab/ 子路径，
  // 资源必须以该子路径为基准，否则上线后 /assets/* 全部 404。
  base: '/ielts-graded-vocab/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 将体积较大的第三方库拆分到独立 chunk，提升浏览器缓存命中率、减小首屏主包。
                manualChunks: {
                    react: ['react', 'react-dom'],
                    motion: ['gsap'],
                    srs: ['ts-fsrs'],
                    data: ['papaparse'],
                    dexie: ['dexie'],
                },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
