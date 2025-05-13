import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/// <reference types="vitest" />

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': process.env // Consider Vite's import.meta.env
  },
  server: {
    watch: {
      ignored: ['**/db.json']
    }
  },
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: 'chromium' }],
      headless: true
    }
  }
});
