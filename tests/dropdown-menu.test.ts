import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ActionsMenu from './fixtures/actions-menu.svelte'

// The menu floats with `visibility: hidden` in jsdom, which has no layout, so
// rows are queried with `hidden: true` and found by their text.
async function row(role: string, text: string): Promise<HTMLElement> {
  const rows = await screen.findAllByRole(role, { hidden: true })
  const match = rows.find((candidate) => candidate.textContent?.trim() === text)

  if (!match) throw new Error(`no ${role} reading "${text}"`)

  return match
}

describe('DropdownMenu', () => {
  it('opens a menu from its trigger', async () => {
    render(ActionsMenu)

    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))

    const menu = await screen.findByRole('menu', { hidden: true })

    expect(menu).toHaveAttribute('data-slot', 'dropdown-menu-content')
    expect(menu).toHaveClass('min-w-44', 'rounded-2xl')
  })

  it('runs a command on select and closes', async () => {
    render(ActionsMenu, { open: true })

    await userEvent.click(await row('menuitem', 'Edit'))

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('closed edit'))
  })

  it('toggles a checkbox item and binds it', async () => {
    render(ActionsMenu, { open: true })

    const item = await row('menuitemcheckbox', 'Show archived')

    expect(item).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(item)

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('archived'))
  })

  it('marks a destructive row for its treatment', async () => {
    render(ActionsMenu, { open: true })

    const item = await row('menuitem', 'Delete')

    expect(item).toHaveAttribute('data-variant', 'destructive')
    expect(item).toHaveClass('data-[variant=destructive]:text-destructive')
  })

  it('draws tone="critical" as the destructive row', async () => {
    render(ActionsMenu, { open: true })

    const item = await row('menuitem', 'Archive')

    expect(item).toHaveAttribute('data-variant', 'destructive')
  })
})
