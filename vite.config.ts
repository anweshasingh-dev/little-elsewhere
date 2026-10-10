import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: { watch: { ignored: ['**/.browser-profile/**', '**/.verification/**'] } },
  test: {
    environment: 'jsdom',
    pool: 'threads',
    maxWorkers: 1,
    setupFiles: ['./src/tests/setup.ts'],
    clearMocks: true,
  },
});
