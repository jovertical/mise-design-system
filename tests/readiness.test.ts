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

  describe('severity', () => {
    const CHECKS: ReadinessItem[] = [
      { id: 'closes', label: 'Every location closed', status: 'unmet', severity: 'block' },
      {
        id: 'count',
        label: 'Stock count recorded',
        status: 'unmet',
        severity: 'warn',
        detail: 'Counted 2 days ago.',
      },
      {
        id: 'drawer',
        label: 'Drawers balance',
        status: 'met',
        severity: 'block',
        detail: 'Off by 0.00.',
      },
    ]

    it('counts block as required and warn as not', () => {
      const summary = summariseReadiness(CHECKS)

      expect(summary.blocking.map((item) => item.id)).toEqual(['closes'])
      expect(summary.complete).toBe(false)
      expect(summariseReadiness(CHECKS.slice(1)).complete).toBe(true)
    })

    it('lets optional win over severity', () => {
      const summary = summariseReadiness([
        { id: 'x', label: 'X', status: 'unmet', severity: 'block', optional: true },
      ])

      expect(summary.blocking).toEqual([])
    })

    it('draws an unmet block critical and an unmet warn as a check', () => {
      render(ReadinessChecklist, { items: CHECKS })

      const block = screen.getByText('Every location closed').closest('li') as HTMLElement
      const warn = screen.getByText('Stock count recorded').closest('li') as HTMLElement

      expect(block).toHaveAttribute('data-severity', 'block')
      expect(block.querySelector('[data-slot="readiness-tag"]')).toHaveTextContent('Required')
      expect(block.querySelector('[data-slot="readiness-tag"]')).toHaveClass('text-destructive')
      expect(warn.querySelector('[data-slot="readiness-tag"]')).toHaveTextContent('Check')
      expect(warn.querySelector('[data-slot="readiness-tag"]')).toHaveClass('text-warning')
    })

    it("hides a met row's detail unless showDetail is all", () => {
      const { unmount } = render(ReadinessChecklist, { items: CHECKS })

      expect(screen.queryByText('Off by 0.00.')).toBeNull()
      expect(screen.getByText('Counted 2 days ago.')).toBeInTheDocument()

      unmount()

      render(ReadinessChecklist, { items: CHECKS, showDetail: 'all' })

      expect(screen.getByText('Off by 0.00.')).toBeInTheDocument()
    })
  })
})
