/**
 * Origin: mise
 * Diverged: none. The data `SidebarNav` draws, and which row is current. The
 *   master portal's `nav-main.tsx` worked it out in the app; mise owns it
 *   (2026-11-10).
 */
import type { Component } from 'svelte'

import type { Tone } from '../../../utils/tone.js'

/** A destination. `disabled` is a page not built yet: drawn, not linked. */
export type SidebarNavLink = {
  label: string
  href: string
  icon?: Component
  /** A count or a word at the row's end: `3`, `'Soon'`. */
  badge?: string | number
  /** Defaults to `neutral`. */
  badgeTone?: Tone
  disabled?: boolean
}

/** A row inside a group. Sub-rows carry no icon. */
export type SidebarNavSubLink = Omit<SidebarNavLink, 'icon'>

/**
 * A row that opens a list. With an `href`, the row is also the section's main
 * page; without one it only toggles.
 */
export type SidebarNavGroup = {
  label: string
  icon?: Component
  href?: string
  items: SidebarNavSubLink[]
}

export type SidebarNavItem = SidebarNavLink | SidebarNavGroup

/** A labelled run of rows. A section may go unlabelled. */
export type SidebarNavSection = { label?: string; items: SidebarNavItem[] }

export function isNavGroup(item: SidebarNavItem): item is SidebarNavGroup {
  return 'items' in item
}

/** `/orders` owns `/orders/OR-2041`; `/` owns only itself. */
export function matchesPath(current: string, href: string): boolean {
  if (href === '/') {
    return current === '/'
  }

  return current === href || current.startsWith(`${href}/`)
}

function hrefsOf(item: SidebarNavItem): string[] {
  if (!isNavGroup(item)) {
    return [item.href]
  }

  const children = item.items.map((child) => child.href)

  return item.href ? [item.href, ...children] : children
}

/**
 * The one row that owns `current`. On `/sales/invoices` both `/sales` and
 * `/sales/invoices` match; the longer is the more specific, so it wins.
 */
export function activeHref(sections: SidebarNavSection[], current: string): string | undefined {
  return sections
    .flatMap((section) => section.items.flatMap(hrefsOf))
    .filter((href) => matchesPath(current, href))
    .sort((first, second) => second.length - first.length)
    .at(0)
}

/** The groups that must be open for `href`'s row to show. */
export function groupsHolding(sections: SidebarNavSection[], href: string | undefined): string[] {
  return sections
    .flatMap((section) => section.items)
    .filter(isNavGroup)
    .filter((group) => group.items.some((child) => child.href === href))
    .map((group) => group.label)
}
