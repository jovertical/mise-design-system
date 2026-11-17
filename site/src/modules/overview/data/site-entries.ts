/**
 * The site's own component entries: every page, mise's API data and
 * since.json, joined on first use. Lazily, because PAGES reads every
 * +page.md eagerly, the overview's among them, and the overview reads this:
 * built at import, it would run before PAGES exists.
 */
import docs from 'virtual:mise-api'

import SINCE from '#modules/docs/data/since.json' with { type: 'json' }
import { PAGES } from '#modules/nav/data/pages.js'

import { type ComponentEntry, componentEntries } from './entries.js'

let entries: ComponentEntry[] | undefined

export function siteEntries(): ComponentEntry[] {
  entries ??= componentEntries(PAGES, docs, SINCE, __MISE_VERSION__)

  return entries
}

/** The entry for a page's href (without the base path), or nothing for a page that is not a component. */
export function entryAt(href: string): ComponentEntry | undefined {
  return siteEntries().find((entry) => entry.href === href)
}
