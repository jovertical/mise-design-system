import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import AppShell from './fixtures/app-shell.svelte'

const desktopMatchMedia = window.matchMedia

afterEach(() => {
  window.matchMedia = desktopMatchMedia
})

/** Makes every media query match, which is what a phone-width viewport looks like to IsMobile. */
function emulatePhone() {
  window.matchMedia = (query: string) =>
    ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

const sidebar = (container: HTMLElement) =>
  container.querySelector('[data-slot="sidebar"]') as HTMLElement

describe('Sidebar', () => {
  it('renders expanded on desktop and publishes the breakpoint', () => {
    const { container } = render(AppShell)

    expect(container.querySelector('[data-slot="sidebar-wrapper"]')).toHaveAttribute(
      'data-mobile',
      'false',
    )

    expect(sidebar(container)).toHaveAttribute('data-state', 'expanded')
  })

  it('defaults to the panel theme, as the portals draw it', () => {
    const { container } = render(AppShell)

    expect(sidebar(container)).toHaveAttribute('data-sidetheme', 'panel')
  })

  it('draws the current panel row as a solid pill, not a tint', () => {
    render(AppShell)

    const active = screen.getByRole('button', { name: 'Locations' })

    expect(active.className).toContain(
      'group-data-[sidetheme=panel]:data-[active=true]:bg-sidebar-primary',
    )

    expect(active.className).not.toContain('group-data-[sidetheme=panel]:data-[active=true]:ring-1')
  })

  it('floats the panel theme inset from the viewport edges, as the portals draw it', () => {
    const { container } = render(AppShell)

    expect(sidebar(container)).toHaveAttribute('data-variant', 'floating')
    expect(container.querySelector('[data-slot="sidebar-container"]')).toHaveClass('p-2')
  })

  it('keeps the other themes flush unless a variant is given', () => {
    const { container } = render(AppShell, { sidetheme: 'primary' })

    expect(sidebar(container)).toHaveAttribute('data-variant', 'sidebar')
  })

  it('draws no edge line on the panel theme, which its own surface separates', () => {
    const { container } = render(AppShell)

    expect(container.querySelector('[data-slot="sidebar-container"]')).toHaveClass(
      'group-data-[sidetheme=panel]:border-r-0',
      'group-data-[sidetheme=panel]:border-l-0',
    )
  })

  it('packs panel rows closer than the other themes', () => {
    const { container } = render(AppShell)

    expect(container.querySelector('[data-slot="sidebar-menu"]')?.className).toContain(
      'group-data-[sidetheme=panel]:gap-0.5',
    )
  })

  it('collapses to icons from the trigger and binds open back', async () => {
    const { container } = render(AppShell)

    await userEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))

    expect(sidebar(container)).toHaveAttribute('data-state', 'collapsed')
    expect(sidebar(container)).toHaveAttribute('data-collapsible', 'icon')
    expect(screen.getByTestId('open')).toHaveTextContent('closed')
  })

  it('toggles with Cmd or Ctrl and B', async () => {
    const { container } = render(AppShell)

    await userEvent.keyboard('{Control>}b{/Control}')

    expect(sidebar(container)).toHaveAttribute('data-state', 'collapsed')
  })

  it('lets the inset shrink, so wide content scrolls inside it instead of widening the page', () => {
    const { container } = render(AppShell)

    expect(container.querySelector('[data-slot="sidebar-inset"]')).toHaveClass('min-w-0')
  })

  it('marks the active row', () => {
    render(AppShell)

    expect(screen.getByRole('button', { name: 'Locations' })).toHaveAttribute('data-active', 'true')
    expect(screen.getByRole('button', { name: 'Orders' })).toHaveAttribute('data-active', 'false')
  })

  it('becomes a sheet on a phone, opened from the trigger', async () => {
    emulatePhone()

    render(AppShell)

    expect(screen.queryByRole('dialog')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))

    const sheet = await screen.findByRole('dialog')

    expect(sheet).toHaveAttribute('data-mobile', 'true')

    await waitFor(() => expect(sheet).toHaveTextContent('Locations'))
  })
})
