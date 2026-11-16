import { docsPages, type PageMeta } from './navigation.js'

/** Every page's frontmatter, read at build. */
const modules = import.meta.glob<PageMeta>('/src/routes/**/+page.md', {
  eager: true,
  import: 'metadata',
})

export const PAGES = docsPages(modules)
