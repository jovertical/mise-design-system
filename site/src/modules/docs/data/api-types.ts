/** mise's API data as the docs read it: the types componentDocs() returns. */
import type { FolderDoc as ComponentFolderDoc } from '../../../../../scripts/skill/component-docs.js'

export type { NamedType, PartDoc } from '../../../../../scripts/skill/component-docs.js'

/** A folder as the site's plugin serves it: componentDocs() plus where it came from. */
export type FolderDoc = ComponentFolderDoc & { origin: 'shadcn' | 'mise' }
