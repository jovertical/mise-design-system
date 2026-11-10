import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import {
  ReadinessChecklist,
  type ReadinessItem,
  ReadinessSummary,
  summariseReadiness,
} from '../src/lib/index.js'

const ITEMS: ReadinessItem[] = [
  { id: 'name', label: 'Name', status: 'met' },
  { id: 'price', label: 'Price', status: 'unmet', detail: 'Set a selling price.' },
  { id: 'photo', label: 'Photo', status: 'unmet', optional: true },
  { id: 'sync', label: 'Register sync', status: 'pending' },
  { id: 'tax', label: 'Tax code', status: 'not-applicable' },
]

describe('summariseReadiness', () => {
  it('drops not-applicable, counts optional toward progress and not permission', () => {
    const summary = summariseReadiness(ITEMS)

    expect(summary.total).toBe(4)
    expect(summary.met).toBe(1)
    expect(summary.percent).toBe(25)
    expect(summary.blocking.map((item) => item.id)).toEqual(['price'])
    expect(summary.pending.map((item) => item.id)).toEqual(['sync'])
    expect(summary.complete).toBe(false)
  })

  it('is complete with only optional rows unmet, and reads zero for nothing', () => {
    expect(
      summariseReadiness([
        { id: 'a', label: 'A', status: 'met' },
        { id: 'b', label: 'B', status: 'unmet', optional: true },
      ]),
    ).toMatchObject({ complete: true, percent: 50 })

    expect(summariseReadiness([])).toMatchObject({ total: 0, percent: 0, complete: true })
  })
})

describe('ReadinessChecklist', () => {
  it('lists the applicable rows, tagging only what is still needed', () => {
    render(ReadinessChecklist, { items: ITEMS })

    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText('Required')).toHaveClass('text-warning')
    expect(screen.getByText('Optional')).toHaveClass('text-muted-foreground')
    expect(screen.getByText('Set a selling price.')).toBeInTheDocument()
    expect(screen.queryByText('Tax code')).toBeNull()
  })

  it('drops the tags for a progress list, and says so when empty', () => {
    const { unmount } = render(ReadinessChecklist, { items: ITEMS, showRequirement: false })

    expect(screen.queryByText('Required')).toBeNull()

    unmount()

    render(ReadinessChecklist, { items: [], emptyMessage: 'No checks for this item.' })

    expect(screen.getByText('No checks for this item.')).toBeInTheDocument()
  })
})

describe('ReadinessSummary', () => {
  it('counts, bars and names what blocks', () => {
    render(ReadinessSummary, { items: ITEMS })

    expect(screen.getByText('25% ready')).toBeInTheDocument()

    expect(screen.getByLabelText('1 of 4 requirements met')).toHaveAttribute(
      'data-slot',
      'progress',
    )

    expect(screen.getByText('Still needed: Price.')).toBeInTheDocument()
  })

  it('waits on pending rows once nothing blocks', () => {
    render(ReadinessSummary, { items: ITEMS.filter((item) => item.id !== 'price') })

    expect(screen.getByText('Waiting on: Register sync.')).toBeInTheDocument()
  })

  it('takes a server override both ways', () => {
    const { unmount } = render(ReadinessSummary, { items: ITEMS, ready: true })

    expect(screen.getByText('Everything required is done.')).toBeInTheDocument()

    unmount()

    render(ReadinessSummary, { items: [{ id: 'a', label: 'A', status: 'met' }], ready: false })

    expect(screen.getByText('Not ready yet.')).toBeInTheDocument()
  })
})
