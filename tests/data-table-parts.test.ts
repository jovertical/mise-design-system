import { render, screen, within } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import DataTableFixture from './fixtures/data-table.svelte'
import RowActions from './fixtures/row-actions.svelte'

/** jsdom draws floating content hidden, without an accessible name, so match by text. */
const menuItem = async (text: string) =>
  (await screen.findByText(text)).closest('[role="menuitem"]') as HTMLElement

describe('DataTableColumnHeader', () => {
  it('sorts a column from its menu, and the arrow follows', async () => {
    const onFiltersChange = vi.fn()

    render(DataTableFixture, { onFiltersChange })

    await userEvent.click(screen.getByRole('button', { name: 'Serial' }))

    await userEvent.click(await menuItem('Desc'))

    expect(onFiltersChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ sorting: [{ id: 'serial', desc: true }] }),
    )

    expect(screen.getByRole('button', { name: 'Serial' }).querySelector('svg')).toHaveClass(
      'tabler-icon-arrow-down',
    )
  })

  it('hides a column from its menu', async () => {
    render(DataTableFixture)

    await userEvent.click(screen.getByRole('button', { name: 'Location' }))

    await userEvent.click(await menuItem('Hide'))

    expect(screen.queryByRole('columnheader', { name: 'Location' })).toBeNull()
  })

  it('leaves a column that does not sort as plain text', () => {
    render(DataTableFixture)

    const head = screen.getByRole('columnheader', { name: 'Last seen' })

    expect(within(head).queryByRole('button')).toBeNull()
  })
})

describe('DataTableRowActions', () => {
  it('opens its menu without firing the row underneath', async () => {
    const onRowClick = vi.fn()

    render(RowActions, { onRowClick })

    const trigger = screen.getByRole('button', { name: 'Actions for Riverside' })

    expect(trigger).toHaveClass('rounded-full')

    await userEvent.click(trigger)

    expect(await menuItem('Edit')).toBeInTheDocument()
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it('keeps a disabled trigger in place', () => {
    render(RowActions, { onRowClick: vi.fn(), disabled: true })

    expect(screen.getByRole('button', { name: 'Actions for Riverside' })).toBeDisabled()
  })
})
