/**
 * The overview's filter: chips for origin, newness and each trait, combined
 * with AND, and a query matched against a component's words and keywords. The
 * chips live in the URL as `?tag=`, so a page's badge links to a filtered list.
 */
import { searchTextOf } from '#modules/nav/data/navigation.js'
import { TRAITS } from '#modules/nav/data/traits.js'

import type { ComponentEntry } from '../data/entries.js'

export const FILTER_TAGS: readonly string[] = ['shadcn', 'mise', 'new', ...TRAITS]

const TAG_TESTS: Record<string, (entry: ComponentEntry) => boolean> = {
  shadcn: (entry) => entry.origin === 'shadcn',
  mise: (entry) => entry.origin === 'mise',
  new: (entry) => entry.isNew,
}

export function matchesTag(entry: ComponentEntry, tag: string): boolean {
  return TAG_TESTS[tag]?.(entry) ?? entry.traits.includes(tag)
}

export function filterEntries(
  entries: ComponentEntry[],
  query: string,
  tags: string[],
): ComponentEntry[] {
  const words = query.trim().toLowerCase()

  return entries.filter(
    (entry) =>
      tags.every((tag) => matchesTag(entry, tag)) &&
      searchTextOf(entry).toLowerCase().includes(words),
  )
}

/** The known tags in a query string, in the order given; anything else is dropped. */
export function tagsFrom(params: Pick<URLSearchParams, 'getAll'>): string[] {
  return params.getAll('tag').filter((tag) => FILTER_TAGS.includes(tag))
}

export function overviewHref(tag: string): string {
  return `/components?${new URLSearchParams({ tag })}`.replace(/\+/g, '%20')
}
