/**
 * The sidebar and the search palette, from the pages' frontmatter: a page is
 * listed once it exists, so the navigation never links to a page not written.
 * Component groups follow mise's own order (tests/groups.ts in mise).
 */
export type PageMeta = {
  title: string
  description?: string
  section?: string
  order?: number
  /** A component page's sub-group, in a section `SUB_GROUPS` splits. */
  group?: string
  /** From `TRAITS`. */
  traits?: string[]
  /** Lowercase words a reader might search for that the title and description lack. */
  keywords?: string[]
}

export type DocsPage = PageMeta & { href: string }
export type NavSection = { label: string; items: { label: string; href: string }[] }

export const GUIDE_SECTIONS = ['Getting started', 'Foundations']

export const COMPONENT_SECTIONS = [
  'Typography',
  'Actions',
  'Forms',
  'Navigation',
  'Layout',
  'Overlays',
  'Feedback',
  'Data display',
]

export const SECTIONS = [...GUIDE_SECTIONS, ...COMPONENT_SECTIONS]

/** The long component sections, split into named runs; the rest list their pages directly. */
export const SUB_GROUPS: Record<string, string[]> = {
  Forms: ['Fields', 'Text input', 'Choices', 'Dates and files'],
  Layout: ['Page', 'Cards', 'Structure'],
  Feedback: ['Messages', 'Page states', 'Progress', 'Gates'],
  'Data display': ['Tables', 'Labels', 'Records', 'Measures', 'Workflows'],
}

export function docsPages(modules: Record<string, PageMeta>): DocsPage[] {
  return Object.entries(modules).map(([file, meta]) => ({ ...meta, href: hrefOf(file) }))
}

export function navSections(pages: DocsPage[]): NavSection[] {
  return SECTIONS.map((label) => ({
    label,
    items: pages
      .filter((page) => page.section === label)
      .toSorted((first, second) => (first.order ?? 0) - (second.order ?? 0))
      .map((page) => ({ label: page.title, href: page.href })),
  })).filter((section) => section.items.length > 0)
}

function hrefOf(file: string) {
  const path = file.replace(/^\/src\/routes/, '').replace(/\/\+page\.md$/, '')

  return path === '' ? '/' : path
}
