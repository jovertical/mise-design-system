// Module types for the docs site's Vite plugins (vite/examples.ts, vite/mise-api.ts).

declare module '*?examples' {
  import type { Example } from '#modules/docs/data/example.js'

  const examples: Record<string, Example>

  export default examples
}

declare module 'virtual:mise-api' {
  import type { FolderDoc } from '#modules/docs/data/api-types.js'

  const docs: FolderDoc[]

  export default docs
}
