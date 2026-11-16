/**
 * `import examples from './examples?examples'` in a page: every `.svelte` file
 * in that folder, as `{ [name]: { component, source, html } }`. The source is
 * the file itself, so the code a page shows is the code that runs; `html` is
 * it highlighted at build, so no highlighter reaches the browser.
 *
 * The module gets a file-like id inside the folder, `examples/__examples__.js`,
 * rather than a `\0` virtual id: the dev server's client then resolves its
 * relative imports like any file's, which it cannot do from a virtual id.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import type { Plugin } from 'vite'

import { highlightCode } from './highlight.js'

export type ExampleEntry = { name: string; path: string; source: string; html: string }

const QUERY = '?examples'
const MODULE = '/__examples__.js'

export function examples(): Plugin {
  let root = process.cwd()

  return {
    name: 'mise-docs-examples',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    resolveId(id, importer) {
      if (id.endsWith(QUERY) && importer) {
        const from = dirname(importer.split('?')[0])

        return `${resolve(from, id.slice(0, -QUERY.length))}${MODULE}`
      }

      // The dev client asks for it by its URL, relative to the root.
      if (id.endsWith(MODULE)) return id.startsWith(root) ? id : join(root, id)

      return null
    },
    async load(id) {
      if (!id.endsWith(MODULE)) return null

      // Each example is watched; the folder is not, since the dev server
      // would try to import a watched path. A new example file needs a reload.
      const entries = await exampleEntries(id.slice(0, -MODULE.length), (path) =>
        this.addWatchFile(path),
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

function exampleEntries(directory: string, watch: (path: string) => void) {
  return Promise.all(
    exampleFiles(directory).map(async (file): Promise<ExampleEntry> => {
      const path = join(directory, file)
      const source = readFileSync(path, 'utf8')

      watch(path)

      const html = await highlightCode(source, 'svelte')

      return { name: file.replace(/\.svelte$/, ''), path: `./${file}`, source, html }
    }),
  )
}

function exampleFiles(directory: string) {
  return readdirSync(directory)
    .filter((file) => file.endsWith('.svelte'))
    .toSorted()
}
