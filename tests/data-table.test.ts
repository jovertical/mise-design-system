import { render, screen, within } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import DataTableFixture from './fixtures/data-table.svelte'

const bodyRows = () => within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')

describe('DataTable', () => {
  it('renders a header and a row per item, closed by a count', () => {
    render(DataTableFixture)
    expect(screen.getByRole('columnheader', { name: 'Serial' })).toBeInTheDocument()
    expect(bodyRows()).toHaveLength(6)
    expect(screen.getByText('RG-0041')).toBeInTheDocument()
    expect(screen.getByText('Showing 6 rows')).toBeInTheDocument()
  })

  it('draws skeleton rows while loading, and no count', () => {
    const { container } = render(DataTableFixture, { isLoading: true, data: [] })
    expect(bodyRows()).toHaveLength(4)
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(16)
    expect(screen.queryByText(/Showing/)).toBeNull()
  })

  it('shows the empty state across every column when there are no rows', () => {
    render(DataTableFixture, { data: [], withEmpty: true })
    const cell = screen.getByText('No devices').closest('td')
    expect(cell).toHaveAttribute('colspan', '4')
  })

  it('heads the card with a title, and lets a footer replace the count', () => {
    render(DataTableFixture, { title: 'Devices', withFooter: true })
    expect(screen.getByText('Devices')).toHaveClass('font-heading')
    expect(screen.getByText('View all devices')).toBeInTheDocument()
    expect(screen.queryByText(/Showing/)).toBeNull()
  })

  it('reports a sort to the caller, who refetches', async () => {
    const onFiltersChange = vi.fn()
    render(DataTableFixture, { withToolbar: true, onFiltersChange })
    await userEvent.click(screen.getByRole('button', { name: 'Sort by serial' }))
    expect(onFiltersChange).toHaveBeenLastCalledWith({
      globalFilter: '',
      columnFilters: [],
      sorting: [{ id: 'serial', desc: false }],
    })
  })

  it('selects rows by checkbox, disabling those that cannot be selected', async () => {
    render(DataTableFixture, { selection: true })
    const boxes = screen.getAllByRole('checkbox', { name: 'Select row' })
    expect(boxes[3]).toBeDisabled()
    await userEvent.click(boxes[0])
    expect(screen.getByText('1 of 6 row(s) selected')).toBeInTheDocument()
    expect(bodyRows()[0]).toHaveAttribute('data-state', 'selected')
  })

  it('makes a row a click target, but not through its checkbox', async () => {
    const onRowClick = vi.fn()
    render(DataTableFixture, { selection: true, onRowClick })
    await userEvent.click(screen.getByText('RG-0107'))
    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ serial: 'RG-0107' }))
    await userEvent.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0])
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })
})
