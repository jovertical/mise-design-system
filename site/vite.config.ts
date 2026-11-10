import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { mdsvex } from 'mdsvex'
import { defineConfig } from 'vitest/config'

/**
 * Every page is prerendered by adapter-static. BASE_PATH is the repository's
 * Pages path in CI. Paths are absolute so the not-found page, served at any
 * depth as 404.html, still finds its assets. Links into /demo/ belong to the
 * other app, so the prerender crawl does not follow them.
 */
const base = (process.env.BASE_PATH ?? '') as '' | `/${string}`

// mdsvex output is legacy-mode Svelte ($$props), so .md files are not forced into runes.
const markdownOrDependency = (filename: string) =>
  filename.endsWith('.md') || filename.split(/[/\\]/).includes('node_modules')

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      extensions: ['.svelte', '.md'],
      preprocess: [mdsvex({ extensions: ['.md'] })],
      compilerOptions: {
        runes: ({ filename }) => (markdownOrDependency(filename) ? undefined : true),
      },
      adapter: adapter(),
      paths: { base, relative: false },
      prerender: {
        entries: ['*'],
        handleHttpError: ({ path, message }) => {
          if (path.startsWith(`${base}/demo`)) return

          throw new Error(message)
        },
      },
    }),
    svelteTesting(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
  },
})
