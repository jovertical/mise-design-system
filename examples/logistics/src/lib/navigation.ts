/**
 * The sidebar's groups and the breadcrumb's source: one list, so a screen is
 * added in one place. Icons are Lucide's canonical files, not aliases.
 */

import Boxes from '@lucide/svelte/icons/boxes'
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard'
import Package from '@lucide/svelte/icons/package'
import Settings from '@lucide/svelte/icons/settings'
import ShoppingCart from '@lucide/svelte/icons/shopping-cart'
import Truck from '@lucide/svelte/icons/truck'
import Users from '@lucide/svelte/icons/users'
import Warehouse from '@lucide/svelte/icons/warehouse'
import type { Component } from 'svelte'
import type { RouteId } from '$app/types'

/** Only routes without parameters can be a menu item. */
type StaticRoute = Exclude<RouteId, `${string}[${string}`>

export type NavItem = { label: string; href: StaticRoute; icon: Component }
export type NavGroup = { label: string; items: NavItem[] }

export const NAVIGATION: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Operations overview', href: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Orders',
    items: [
      { label: 'Orders', href: '/orders', icon: ShoppingCart },
      { label: 'Shipments', href: '/shipments', icon: Package },
    ],
  },
  { label: 'Fleet', items: [{ label: 'Fleet', href: '/fleet', icon: Truck }] },
  {
    label: 'Inventory',
    items: [
      { label: 'Products', href: '/products', icon: Boxes },
      { label: 'Warehouses', href: '/warehouses', icon: Warehouse },
    ],
  },
  { label: 'Partners', items: [{ label: 'Clients', href: '/clients', icon: Users }] },
  {
    label: 'Settings',
    items: [{ label: 'General', href: '/settings/general', icon: Settings }],
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
