import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import DrawerHarness from './fixtures/drawer-harness.svelte'

const panel = () => document.body.querySelector('[data-slot="drawer-content"]') as HTMLElement

describe('Drawer', () => {
  it('opens from its trigger as a dialog named by its title', async () => {
    render(DrawerHarness)
    expect(panel()).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    const dialog = await screen.findByRole('dialog', { name: 'Filter transfers' })
    expect(dialog).toHaveAttribute('data-slot', 'drawer-content')
    expect(dialog).toHaveAccessibleDescription('Narrow the list by location and status.')
    expect(screen.getByTestId('open')).toHaveTextContent('open')
  })

  it('slides from the bottom by default, with the drag handle', async () => {
    render(DrawerHarness, { open: true })
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(panel()).toHaveAttribute('data-vaul-drawer-direction', 'bottom')
    expect(panel()).toHaveClass('group/drawer-content', 'bg-background', 'fixed', 'z-50')
    expect(document.body.querySelector('[data-slot="drawer-overlay"]')).toHaveClass('bg-black/50')
  })

  it('takes a direction', async () => {
    render(DrawerHarness, { open: true, direction: 'right' })
    await waitFor(() => expect(panel()).toHaveAttribute('data-vaul-drawer-direction', 'right'))
  })

  it('closes from its close button', async () => {
    render(DrawerHarness, { open: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })
})
