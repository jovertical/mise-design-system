import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import DataTableViews from './fixtures/data-table-views.svelte'

describe('DataTable views', () => {
  it('draws a card per item in grid view, and no table', () => {
    const { container } = render(DataTableViews, { view: 'grid' })

    expect(screen.getAllByTestId('card')).toHaveLength(6)
    expect(screen.queryByRole('table')).toBeNull()
    expect(container.querySelector('[data-slot="data-table"]')).toHaveAttribute('data-view', 'grid')
  })

  it('opens a row onto its children, counting top-level rows only', async () => {
    render(DataTableViews, { view: 'expandable' })

    expect(screen.getByText('Showing 3 rows')).toBeInTheDocument()
    expect(screen.queryByText('RG-0041')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: /Riverside/ }))

    expect(screen.getByText('RG-0041').closest('tr')).toHaveAttribute('data-depth', '1')
    expect(screen.getByText('Showing 3 rows')).toBeInTheDocument()
  })

  it('offers the next page in the closing strip, and spins while it loads', async () => {
    const fetchNextPage = vi.fn()
    const { rerender } = render(DataTableViews, { view: 'more', fetchNextPage })

    await userEvent.click(screen.getByRole('button', { name: 'Load more' }))

    expect(fetchNextPage).toHaveBeenCalledOnce()

    await rerender({ view: 'more', fetchNextPage, isFetchingNextPage: true })

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
