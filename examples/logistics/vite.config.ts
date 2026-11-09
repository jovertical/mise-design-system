import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

/**
 * A single-page app: every route renders in the browser, and adapter-static
 * writes a 404.html that GitHub Pages serves for any deep link, which then
 * boots the router. BASE_PATH is the repository's Pages path in CI.
 */
export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter({ fallback: '404.html' }),
      paths: { base: (process.env.BASE_PATH ?? '') as '' | `/${string}` },
    }),
  ],
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] },
})
