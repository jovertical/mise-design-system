/**
 * The sidebar and the search palette, from the pages' frontmatter: a page is
 * listed once it exists, so the navigation never links to a page not written.
 * Component groups follow mise's own order (tests/groups.ts in mise).
 */
export type PageMeta = { title: string; description?: string; section?: string; order?: number }
export type DocsPage = PageMeta & { href: string }
export type NavSection = { label: string; items: { label: string; href: string }[] }

export const SECTIONS = [
  'Getting started',
  'Foundations',
  'Typography',
  'Actions',
  'Forms',
  'Navigation',
  'Layout',
  'Overlays',
  'Feedback',
  'Data display',
]

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
