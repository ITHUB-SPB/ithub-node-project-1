import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['node_modules/**', 'tests/e2e/**'],
    coverage: {
      include: ['src/**/*.js'],
      reportsDirectory: 'tests/coverage'
    },
  },
})