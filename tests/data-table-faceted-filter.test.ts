import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import FacetedFilter from './fixtures/faceted-filter.svelte'

/** jsdom draws floating content hidden, without an accessible name, so match by text. */
const option = async (text: string) =>
  (await screen.findByText(text)).closest('[data-slot="command-item"]') as HTMLElement

describe('DataTableFacetedFilter', () => {
  it('reads as a select that summarises the choice, with a count per option', async () => {
    render(FacetedFilter)

    const trigger = screen.getByRole('button', { name: 'All status' })

    expect(trigger).toHaveClass('text-muted-foreground', 'bg-input/50')

    await userEvent.click(trigger)

    expect(await option('Online')).toHaveTextContent(/Online\s*3/)
  })

  it('filters by the chosen values, naming one and counting more', async () => {
    const onFiltersChange = vi.fn()

    render(FacetedFilter, { onFiltersChange })

    await userEvent.click(screen.getByRole('button', { name: 'All status' }))

    await userEvent.click(await option('Online'))

    expect(onFiltersChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ columnFilters: [{ id: 'status', value: ['online'] }] }),
    )

    expect(screen.getByRole('button', { name: 'Online' })).not.toHaveClass('text-muted-foreground')

    await userEvent.click(await option('Offline'))

    expect(screen.getByRole('button', { name: '2 selected' })).toBeInTheDocument()
  })

  it('clears the filter from the all row', async () => {
    const onFiltersChange = vi.fn()

    render(FacetedFilter, { onFiltersChange })

    await userEvent.click(screen.getByRole('button', { name: 'All status' }))

    await userEvent.click(await option('Online'))

    await userEvent.click(await option('All status'))

    expect(onFiltersChange).toHaveBeenLastCalledWith(expect.objectContaining({ columnFilters: [] }))
  })
})
