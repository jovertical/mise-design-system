import type {
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavLink,
  SidebarNavSection,
  SidebarNavSubItem,
} from '@jovertical/mise-design-system'

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

function inOrder(pages: DocsPage[]): DocsPage[] {
  return pages.toSorted((first, second) => (first.order ?? 0) - (second.order ?? 0))
}

function linkTo(page: DocsPage): SidebarNavLink {
  return { label: page.title, href: page.href }
}

/** A section's pages, each sub-group's under its heading where the section has them. */
function componentGroup(section: string, pages: DocsPage[]): SidebarNavGroup {
  const groups = SUB_GROUPS[section]

  if (!groups) return { label: section, items: inOrder(pages).map(linkTo) }

  const items: SidebarNavSubItem[] = groups.flatMap((group) => {
    const members = inOrder(pages.filter((page) => page.group === group))

    return members.length > 0 ? [{ heading: group }, ...members.map(linkTo)] : []
  })

  return { label: section, items }
}

/**
 * The guides as labelled runs of links; then one Components section, led by
 * the overview once it exists, with a folding group per component section.
 */
export function navSections(pages: DocsPage[]): SidebarNavSection[] {
  const inSection = (label: string) => pages.filter((page) => page.section === label)

  const guides = GUIDE_SECTIONS.map((label) => ({
    label,
    items: inOrder(inSection(label)).map(linkTo),
  }))

  // The overview page is titled for its own header; in the menu it is the Components section's first row.
  const overview = pages
    .filter((page) => page.href === '/components')
    .map((page) => ({ label: 'Overview', href: page.href }))

  const groups = COMPONENT_SECTIONS.filter((label) => inSection(label).length > 0).map((label) =>
    componentGroup(label, inSection(label)),
  )

  const components = { label: 'Components', items: [...overview, ...groups] }

  return [...guides, components].filter((section) => section.items.length > 0)
}

/** Every href rewritten, inside groups too: the Pages base path, for one. */
export function withHrefs(
  sections: SidebarNavSection[],
  rewrite: (href: string) => string,
): SidebarNavSection[] {
  const rewriteItem = (item: SidebarNavItem): SidebarNavItem => {
    if (!('items' in item)) return { ...item, href: rewrite(item.href) }

    return {
      ...item,
      href: item.href === undefined ? undefined : rewrite(item.href),
      items: item.items.map((child) =>
        'heading' in child ? child : { ...child, href: rewrite(child.href) },
      ),
    }
  }

  return sections.map((section) => ({ ...section, items: section.items.map(rewriteItem) }))
}

function hrefOf(file: string) {
  const path = file.replace(/^\/src\/routes/, '').replace(/\/\+page\.md$/, '')

  return path === '' ? '/' : path
}
