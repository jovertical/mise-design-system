import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { defineConfig } from 'vitest/config'

/**
 * SvelteKit 3 takes its config here; there is no svelte.config.js. It is
 * build tooling only: `svelte-package` builds `src/lib`, and Storybook reads
 * this file. There are no routes and no adapter, because nothing is deployed.
 */
export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Runes everywhere except dependencies. Can go in Svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
      },
    }),
    svelteTesting(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
})
