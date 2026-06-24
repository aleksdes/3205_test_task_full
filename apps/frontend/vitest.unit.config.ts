import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    environment: 'node',
    setupFiles: ['./src/shared/test/setup/unit.ts'],
    include: ['src/**/__unit-tests__/**/*.test.ts'],
  },
})
