/**
 * `import docs from 'virtual:mise-api'`: componentDocs() over mise's source,
 * the data the skill catalogue renders, so a page's API table cannot drift
 * from the Props types. In dev, a change under src/lib/components reloads it.
 */
import { join } from 'node:path'

import type { Plugin } from 'vite'

import { componentDocs } from '../../scripts/skill/component-docs.js'

const ID = 'virtual:mise-api'
const RESOLVED = `\0${ID}`
const REPOSITORY = join(import.meta.dirname, '..', '..')

export function miseApi(root = REPOSITORY): Plugin {
  const components = join(root, 'src', 'lib', 'components')

  return {
    name: 'mise-docs-api',
    resolveId: (id) => (id === ID ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null

      return `export default ${JSON.stringify(componentDocs(root))}`
    },
    configureServer(server) {
      server.watcher.add(components)

      server.watcher.on('change', (file) => {
        if (!file.startsWith(components)) return

        const module = server.moduleGraph.getModuleById(RESOLVED)

        if (module) server.reloadModule(module)
      })
    },
  }
}
