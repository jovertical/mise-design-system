import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import Controls from './fixtures/data-table-controls.svelte'

/** jsdom draws floating content hidden, without an accessible name, so match by text. */
const menuItem = async (text: string) =>
  (await screen.findByText(text)).closest('[role^="menuitem"]') as HTMLElement

describe('DataTableColumnToggle', () => {
  it('hides a column when its box is cleared', async () => {
    render(Controls)

    await userEvent.click(screen.getByRole('button', { name: 'Toggle columns' }))

    await userEvent.click(await menuItem('location'))

    expect(screen.queryByRole('columnheader', { name: 'Location' })).toBeNull()
  })
})

describe('DataTableViewToggle', () => {
  it('switches the table to its grid', async () => {
    render(Controls)

    await userEvent.click(screen.getByRole('radio', { name: 'Grid view' }))

    expect(screen.getAllByTestId('card')).toHaveLength(6)
    expect(screen.queryByRole('table')).toBeNull()
  })
})

describe('DataTableExportMenu', () => {
  it('offers only what the page wires', async () => {
    const onExportCsv = vi.fn()

    render(Controls, { onExportCsv, onPrint: vi.fn() })

    await userEvent.click(screen.getByRole('button', { name: 'Export' }))

    await userEvent.click(await menuItem('CSV'))

    expect(onExportCsv).toHaveBeenCalledOnce()
    expect(screen.queryByText('Copy')).toBeNull()
  })

  it('copies the rows as text', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)

    Object.assign(navigator, { clipboard: { writeText } })

    render(Controls, { getCopyText: () => 'serial\tlocation' })

    await userEvent.click(screen.getByRole('button', { name: 'Export' }))

    await userEvent.click(await menuItem('Copy'))

    expect(writeText).toHaveBeenCalledWith('serial\tlocation')
  })

  it('draws nothing when the page wires no export', () => {
    render(Controls)

    expect(screen.queryByRole('button', { name: 'Export' })).toBeNull()
  })

  it('shows a print-only menu when print is wired', async () => {
    const onPrint = vi.fn()

    render(Controls, { onPrint })

    await userEvent.click(screen.getByRole('button', { name: 'Export' }))

    await userEvent.click(await menuItem('Print'))

    expect(onPrint).toHaveBeenCalledOnce()
  })
})
