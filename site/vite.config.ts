import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import { escapeSvelte, mdsvex } from 'mdsvex'
import { defineConfig } from 'vitest/config'

import { examples } from './vite/examples.js'
import { highlightCode } from './vite/highlight.js'
import { baseLinks, headingIds } from './vite/markdown.js'
import { miseApi } from './vite/mise-api.js'

/**
 * Every page is prerendered by adapter-static. BASE_PATH is the repository's
 * Pages path in CI. Paths are absolute so the not-found page, served at any
 * depth as 404.html, still finds its assets. Links into /demo/ belong to the
 * other app, so the prerender crawl does not follow them.
 */
const base = (process.env.BASE_PATH ?? '') as '' | `/${string}`

// The sidebar shows the version of mise the docs were built from.
const { version } = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8'),
)

// mdsvex output is legacy-mode Svelte ($$props), so .md files are not forced into runes.
const markdownOrDependency = (filename: string) =>
  filename.endsWith('.md') || filename.split(/[/\\]/).includes('node_modules')

export default defineConfig({
  define: { __MISE_VERSION__: JSON.stringify(version) },
  plugins: [
    tailwindcss(),
    miseApi(),
    examples(),
    sveltekit({
      extensions: ['.svelte', '.md'],
      preprocess: [
        mdsvex({
          extensions: ['.md'],
          layout: {
            _: join(import.meta.dirname, 'src/modules/docs/components/page-layout.svelte'),
          },
          remarkPlugins: [baseLinks(base), headingIds()],
          highlight: {
            highlighter: async (code, language) =>
              `{@html \`${escapeSvelte(await highlightCode(code, language ?? 'text'))}\`}`,
          },
        }),
      ],
      compilerOptions: {
        runes: ({ filename }) => (markdownOrDependency(filename) ? undefined : true),
      },
      adapter: adapter(),
      paths: { base, relative: false },
      prerender: {
        entries: ['*', '/not-found'],
        // An example's links are #/… placeholders that go nowhere (the Sidebar
        // page's menus); any other anchor must exist.
        handleMissingId: ({ id, message }) => {
          if (id.startsWith('/')) return

          throw new Error(message)
        },
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
