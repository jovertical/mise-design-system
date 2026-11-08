import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import Toolbar from './fixtures/toolbar.svelte'

describe('DataTableToolbar', () => {
  it('lays out search and filters on the left, actions on the right', () => {
    render(Toolbar)
    expect(screen.getByRole('textbox', { name: 'Search devices' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All status' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'All missing' })).toBeNull()
    const right = screen.getByRole('button', { name: 'Export' }).closest('.ml-auto')
    expect(right).toContainElement(screen.getByRole('button', { name: 'Toggle columns' }))
  })

  it('searches after the reader pauses, and clears both halves', async () => {
    const onFiltersChange = vi.fn()
    render(Toolbar, { onFiltersChange })
    await userEvent.type(screen.getByRole('textbox', { name: 'Search devices' }), 'RG-01')
    await waitFor(() =>
      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ globalFilter: 'RG-01' }),
      ),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    await waitFor(() =>
      expect(onFiltersChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ globalFilter: '', columnFilters: [] }),
      ),
    )
    expect(screen.getByRole('textbox', { name: 'Search devices' })).toHaveValue('')
  })

  it('shows the view toggle when the mode is bound, and drops the column toggle in grid view', async () => {
    render(Toolbar, { withViewToggle: true })
    await userEvent.click(screen.getByRole('radio', { name: 'Grid view' }))
    expect(screen.queryByRole('button', { name: 'Toggle columns' })).toBeNull()
  })
})
