/**
 * One entry per component page: its frontmatter joined with where the
 * component came from (mise's API data) and the release it arrived in
 * (since.json). The overview lists them; a page's rail shows its own.
 */

import { isNew, sinceOf } from '#modules/docs/data/tags.js'
import { COMPONENT_SECTIONS, type DocsPage, SUB_GROUPS } from '#modules/nav/data/navigation.js'

export type Origin = 'shadcn' | 'mise'

export type ComponentEntry = {
  title: string
  href: string
  description: string
  section: string
  group?: string
  order: number
  origin: Origin
  since: string | null
  isNew: boolean
  traits: string[]
  keywords: string[]
}

export type EntryGroup = { group?: string; entries: ComponentEntry[] }

export type EntrySection = { section: string; groups: EntryGroup[] }

/** A page's mise folder: the last segment of its href, as the routes mirror mise's folders. */
const folderOf = (href: string) => href.split('/').at(-1) ?? ''

export function componentEntries(
  pages: DocsPage[],
  docs: { folder: string; origin: Origin }[],
  releases: Record<string, string>,
  current: string,
): ComponentEntry[] {
  return pages
    .filter((page) => page.section !== undefined && COMPONENT_SECTIONS.includes(page.section))
    .map((page) => {
      const folder = folderOf(page.href)
      const since = sinceOf(folder, releases)

      return {
        title: page.title,
        href: page.href,
        description: page.description ?? '',
        section: page.section ?? '',
        group: page.group,
        order: page.order ?? 0,
        origin: docs.find((doc) => doc.folder === folder)?.origin ?? 'mise',
        since,
        isNew: isNew(since, current),
        traits: page.traits ?? [],
        keywords: page.keywords ?? [],
      }
    })
}

const inOrder = (entries: ComponentEntry[]) =>
  entries.toSorted((first, second) => first.order - second.order)

/** By section in mise's order, then sub-group in SUB_GROUPS order, then page order. */
export function sectionsOf(entries: ComponentEntry[]): EntrySection[] {
  return COMPONENT_SECTIONS.map((section) => {
    const members = entries.filter((entry) => entry.section === section)
    const named = SUB_GROUPS[section]

    const groups: EntryGroup[] = named
      ? named.map((group) => ({
          group,
          entries: inOrder(members.filter((entry) => entry.group === group)),
        }))
      : [{ entries: inOrder(members) }]

    return { section, groups: groups.filter((group) => group.entries.length > 0) }
  }).filter((section) => section.groups.length > 0)
}
