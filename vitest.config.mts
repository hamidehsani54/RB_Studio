import path from 'path'
import { defineConfig } from 'vitest/config'

const smoke = Boolean(process.env.SMOKE)

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // `server-only` throws outside Next.js server components; tests run in plain Node.
    alias: { 'server-only': path.resolve('tests/helpers/empty.ts') },
  },
  test: {
    environment: 'node',
    include: smoke ? ['tests/e2e/**/*.test.ts'] : ['tests/unit/**/*.test.ts', 'tests/int/**/*.test.ts'],
    setupFiles: smoke ? [] : ['tests/setup.ts'],
    globalSetup: smoke ? [] : ['tests/global-setup.ts'],
    // Integration tests share one SQLite test database, so files run one after another.
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 180_000,
  },
})
