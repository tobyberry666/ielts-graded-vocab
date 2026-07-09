import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
// Vite + Vitest share this config. The SRS scheduling core is pure and runs
// under Node in tests; the UI runs in the browser via `npm run dev`.
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
