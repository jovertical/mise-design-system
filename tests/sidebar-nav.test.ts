import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  activeHref,
  groupsHolding,
  matchesPath,
  type SidebarNavSection,
} from '../src/lib/components/navigation/sidebar/sidebar-nav.js'
import SidebarNavHarness from './fixtures/sidebar-nav-harness.svelte'

const SECTIONS: SidebarNavSection[] = [
  {
    label: 'Operations',
    items: [
      { label: 'Overview', href: '/' },
      { label: 'Orders', href: '/orders' },
      {
        label: 'Sales',
        href: '/sales',
        items: [
          { label: 'Invoices', href: '/sales/invoices' },
          { label: 'Refunds', href: '/sales/refunds' },
        ],
      },
    ],
  },
]

describe('matchesPath', () => {
  it('matches a path and everything under it', () => {
    expect(matchesPath('/orders', '/orders')).toBe(true)
    expect(matchesPath('/orders/OR-2041', '/orders')).toBe(true)
    expect(matchesPath('/ordersx', '/orders')).toBe(false)
  })

  it('matches the root only on itself', () => {
    expect(matchesPath('/', '/')).toBe(true)
    expect(matchesPath('/orders', '/')).toBe(false)
  })
})

describe('activeHref', () => {
  it('picks the most specific match, so one row lights up', () => {
    expect(activeHref(SECTIONS, '/sales/invoices/INV-9')).toBe('/sales/invoices')
  })

  it('falls back to a group link when no sub-link matches', () => {
    expect(activeHref(SECTIONS, '/sales')).toBe('/sales')
  })

  it('finds nothing for a path outside the menu', () => {
    expect(activeHref(SECTIONS, '/elsewhere')).toBeUndefined()
  })
})

describe('groupsHolding', () => {
  it('names the group whose sub-link is current', () => {
    expect(groupsHolding(SECTIONS, '/sales/refunds')).toEqual(['Sales'])
    expect(groupsHolding(SECTIONS, '/orders')).toEqual([])
  })
})

describe('SidebarNav', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('draws each section under its label', () => {
    render(SidebarNavHarness, { current: '/' })

    expect(screen.getByText('Operations')).toHaveAttribute('data-slot', 'sidebar-group-label')
  })

  it('marks only the most specific row current', () => {
    render(SidebarNavHarness, { current: '/sales/invoices/INV-9' })

    const invoices = screen.getByRole('link', { name: 'Invoices' })

    expect(invoices).toHaveAttribute('data-active', 'true')
    expect(invoices).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Sales' })).toHaveAttribute('data-active', 'false')
    expect(screen.getByRole('link', { name: 'Orders' })).not.toHaveAttribute('aria-current')
  })

  it('opens the group holding the current row', () => {
    render(SidebarNavHarness, { current: '/sales/refunds' })

    expect(screen.getByRole('button', { name: 'Collapse Sales' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('toggles a group from its chevron, and keeps closed links out of the tab order', async () => {
    const { container } = render(SidebarNavHarness, { current: '/' })
    // Svelte sets `inert` as a property; jsdom does not reflect it to the attribute.
    const list = () => container.querySelector('[data-slot="sidebar-nav-sub"]') as HTMLElement

    expect(list().inert).toBe(true)

    await userEvent.click(screen.getByRole('button', { name: 'Expand Sales' }))

    expect(screen.getByRole('button', { name: 'Collapse Sales' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    expect(list().inert).toBe(false)
  })

  it('remembers open groups under persistKey', async () => {
    const first = render(SidebarNavHarness, { current: '/', persistKey: 'test-nav' })

    await userEvent.click(screen.getByRole('button', { name: 'Expand Sales' }))

    first.unmount()

    expect(JSON.parse(localStorage.getItem('test-nav') ?? '[]')).toEqual(['Sales'])

    render(SidebarNavHarness, { current: '/', persistKey: 'test-nav' })

    expect(screen.getByRole('button', { name: 'Collapse Sales' })).toBeInTheDocument()
  })

  it('draws a badge, and a disabled row as text rather than a link', () => {
    render(SidebarNavHarness, { current: '/' })

    expect(screen.getByText('3')).toHaveAttribute('data-slot', 'badge')
    expect(screen.queryByRole('link', { name: /Marketplace/ })).toBeNull()
    expect(screen.getByText('Marketplace').closest('[aria-disabled="true"]')).not.toBeNull()
  })

  it('opens a group as a menu beside the rail when collapsed to icons', async () => {
    render(SidebarNavHarness, { current: '/', open: false })

    const trigger = screen.getByRole('button', { name: 'Sales' })

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')

    await userEvent.click(trigger)

    // Floating content is `visibility: hidden` in jsdom, so it is found by text.
    const refunds = await screen.findByText('Refunds')

    expect(refunds).toHaveAttribute('data-slot', 'dropdown-menu-item')
    expect(refunds).toHaveAttribute('href', '/sales/refunds')
  })

  it('renders links through the link snippet when given', () => {
    render(SidebarNavHarness, { current: '/', customLink: true })

    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('data-router', 'custom')
  })
})
