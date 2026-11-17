/**
 * `import docs from 'virtual:mise-api'`: componentDocs() over mise's source,
 * the data the skill catalogue renders, so a page's API table cannot drift
 * from the Props types. Each folder also carries its origin, read from its
 * root component's header. In dev, a change under src/lib/components reloads it.
 */
import { join } from 'node:path'

import type { Plugin } from 'vite'

import { componentDocs } from '../../scripts/skill/component-docs.js'
import { folderOrigin } from './origin.js'

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

      const docs = componentDocs(root).map((doc) => ({
        ...doc,
        origin: folderOrigin(join(components, doc.group, doc.folder), doc.folder),
      }))

      return `export default ${JSON.stringify(docs)}`
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
