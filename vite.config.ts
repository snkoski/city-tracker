import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// vite.config.ts

/// <reference types="vitest" />
/// <reference types="@vitest/browser" /> // Add this for browser types

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': process.env // Consider Vite's import.meta.env
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
