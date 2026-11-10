/**
 * `import examples from './examples?examples'` in a page: every `.svelte` file
 * in that folder, as `{ [name]: { component, source, html } }`. The source is
 * the file itself, so the code a page shows is the code that runs; `html` is
 * it highlighted at build, so no highlighter reaches the browser.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import type { Plugin } from 'vite'

import { highlightCode } from './highlight.js'

export type ExampleEntry = { name: string; path: string; source: string; html: string }

const QUERY = '?examples'
const PREFIX = '\0examples:'

export function examples(): Plugin {
  return {
    name: 'mise-docs-examples',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!id.endsWith(QUERY) || !importer) return null

      const from = dirname(importer.split('?')[0])

      return `${PREFIX}${resolve(from, id.slice(0, -QUERY.length))}`
    },
    async load(id) {
      if (!id.startsWith(PREFIX)) return null

      const directory = id.slice(PREFIX.length)

      this.addWatchFile(directory)

      const entries = await Promise.all(
        exampleFiles(directory).map(async (file) => {
          const path = join(directory, file)
          const source = readFileSync(path, 'utf8')

          this.addWatchFile(path)

          const html = await highlightCode(source, 'svelte')

          return { name: file.replace(/\.svelte$/, ''), path, source, html }
        }),
      )

      return exampleModuleSource(entries)
    },
  }
}

export function exampleModuleSource(entries: ExampleEntry[]): string {
  const imports = entries.map(
    (entry, index) => `import example${index} from ${JSON.stringify(entry.path)}`,
  )

  const fields = entries.map((entry, index) => {
    const source = JSON.stringify(entry.source)
    const html = JSON.stringify(entry.html)

    return `  ${JSON.stringify(entry.name)}: { component: example${index}, source: ${source}, html: ${html} },`
  })

  return [...imports, '', 'export default {', ...fields, '}', ''].join('\n')
}

function exampleFiles(directory: string) {
  return readdirSync(directory)
    .filter((file) => file.endsWith('.svelte'))
    .toSorted()
}
