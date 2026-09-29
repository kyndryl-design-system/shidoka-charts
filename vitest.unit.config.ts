import { defineConfig } from 'vitest/config';

/**
 * Node project for pure mapping and layout modules. The browser project in
 * `vitest.config.ts` stays the source of truth for story level tests.
 */
export default defineConfig({
  test: {
    name: 'unit',
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
