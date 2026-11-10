import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ChecklistCard } from '../src/lib/index.js'
import ChecklistHarness from './fixtures/checklist-harness.svelte'

const ITEMS = [
  { id: 'a', label: 'Add a category', done: true },
  { id: 'b', label: 'Add your first product', done: false },
]

describe('ChecklistCard', () => {
  // 99.6% prints 100% but has not finished: the ring keeps its unfinished colour.
  it.each([
    [99.6, 'stroke-primary'],
    [100, 'stroke-success'],
  ])('tones the ring by the raw share at %s', (percent, stroke) => {
    render(ChecklistCard, { title: 'Get started', percent, items: ITEMS })

    const ring = screen.getByLabelText('100% complete')

    expect(ring).toHaveAttribute('data-slot', 'radial-stat')
    expect(ring.querySelector(`.${stroke}`)).not.toBeNull()
  })

  it('lists rows with their state for a screen reader', () => {
    render(ChecklistCard, { title: 'Get started', percent: 50, items: ITEMS })

    const rows = screen.getAllByRole('listitem')

    expect(rows.map((row) => row.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Completed: Add a category',
      'Not started: Add your first product',
    ])

    expect(screen.getByText('Add a category')).toHaveClass('text-muted-foreground', 'truncate')
  })

  it('collapses to a solid icon whose name carries the title and share', () => {
    render(ChecklistCard, { title: 'Get started', percent: 25, items: ITEMS, collapsed: true })

    expect(screen.getByRole('img', { name: 'Get started: 25% complete' })).toHaveClass('bg-primary')
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('outlines and shrinks on request', () => {
    const { container } = render(ChecklistCard, {
      title: 'Get started',
      percent: 0,
      items: ITEMS,
      size: 'sm',
      variant: 'outline',
    })

    const card = container.querySelector('[data-slot="card"]') as HTMLElement

    expect(card).toHaveClass('bg-transparent', 'ring-border', '[--card-spacing:--spacing(3)]')
  })
})

describe('Checklist', () => {
  it('heads each group with its share, bar and figure', () => {
    render(ChecklistHarness)

    expect(screen.getByText('50%')).toHaveClass('tabular-nums')

    expect(screen.getByLabelText('Set up your menu: 50% complete')).toHaveAttribute(
      'data-slot',
      'progress',
    )
  })

  it('names each row by its state', () => {
    render(ChecklistHarness)

    const names = screen
      .getAllByRole('listitem')
      .map((row) => row.querySelector('.sr-only')?.textContent)

    expect(names).toEqual(['Completed:', 'Skipped:', 'Not started:'])
  })

  it('opens one row at a time from its trigger, and reports a close as null', async () => {
    render(ChecklistHarness)

    await userEvent.click(screen.getByRole('button', { name: /Add your first product/ }))

    await waitFor(() => expect(screen.getByTestId('expanded')).toHaveTextContent('product'))

    expect(screen.getByText('Something to sell.')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: /Add a category/, expanded: false }))

    await waitFor(() => expect(screen.getByTestId('expanded')).toHaveTextContent('category'))

    await userEvent.click(screen.getAllByRole('button', { name: 'Collapse' })[0])

    await waitFor(() => expect(screen.getByTestId('expanded')).toHaveTextContent('none'))
  })

  it('draws a row with nothing to reveal as no disclosure at all', () => {
    render(ChecklistHarness)

    const skipped = screen
      .getByText('Add a second location')
      .closest('[role="listitem"]') as HTMLElement

    expect(skipped.querySelector('button')).toBeNull()
  })

  it('keeps a row action beside the disclosure, not inside it', () => {
    render(ChecklistHarness)

    const action = screen.getByRole('button', { name: 'Add a category', expanded: undefined })

    expect(action.closest('[data-slot="collapsible-trigger"]')).toBeNull()
  })
})
