/**
 * The sidebar's sections and the breadcrumb's source: one list, so a screen is
 * added in one place. Its shape is mise's `SidebarNavSection`, with routes the
 * sidebar resolves.
 */

import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
import IconLayoutDashboard from '@tabler/icons-svelte-runes/icons/layout-dashboard'
import IconPackage from '@tabler/icons-svelte-runes/icons/package'
import IconPackages from '@tabler/icons-svelte-runes/icons/packages'
import IconSettings from '@tabler/icons-svelte-runes/icons/settings'
import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
import IconTruck from '@tabler/icons-svelte-runes/icons/truck'
import IconUsers from '@tabler/icons-svelte-runes/icons/users'
import type { Component } from 'svelte'
import type { RouteId } from '$app/types'

/** Only routes without parameters can be a menu item. */
type StaticRoute = Exclude<RouteId, `${string}[${string}`>

export type NavItem = { label: string; href: StaticRoute; icon: Component }
export type NavGroup = { label: string; items: NavItem[] }

export const NAVIGATION: NavGroup[] = [
  {
    label: 'Operations',
    items: [
      { label: 'Overview', href: '/', icon: IconLayoutDashboard },
      { label: 'Orders', href: '/orders', icon: IconShoppingCart },
      { label: 'Shipments', href: '/shipments', icon: IconPackage },
      { label: 'Fleet', href: '/fleet', icon: IconTruck },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { label: 'Products', href: '/products', icon: IconPackages },
      { label: 'Warehouses', href: '/warehouses', icon: IconBuildingWarehouse },
    ],
  },
  { label: 'Partners', items: [{ label: 'Clients', href: '/clients', icon: IconUsers }] },
  {
    label: 'Settings',
    items: [{ label: 'General', href: '/settings/general', icon: IconSettings }],
  },
]

/** The group and item a path belongs to: `/orders/OR-2041` is under Orders › Orders. */
export function locate(pathname: string): { group: NavGroup; item: NavItem } | null {
  let best: { group: NavGroup; item: NavItem } | null = null

  for (const group of NAVIGATION) {
    for (const item of group.items) {
      const matches =
        item.href === '/'
          ? pathname === '/'
          : pathname === item.href || pathname.startsWith(`${item.href}/`)

      if (matches && (!best || item.href.length > best.item.href.length)) best = { group, item }
    }
  }

  return best
}
