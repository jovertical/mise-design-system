import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { MetricRank } from '../src/lib/index.js'
import MetricBarFixture from './fixtures/metric-bar.svelte'

describe('MetricBar', () => {
  it('puts the figure on the label line and names the bar for a screen reader', () => {
    render(MetricBarFixture)
    expect(screen.getByText('589')).toHaveClass('tabular-nums', 'text-muted-foreground')
    expect(screen.getByText('Selling now')).toHaveClass('text-xs')
    expect(screen.getByText('589 / 775')).toHaveClass('text-xs', 'tabular-nums')
    const bar = screen.getByRole('progressbar', { name: 'Active: 76%' })
    expect(bar).toHaveAttribute('aria-valuenow', '76')
  })

  it('fills primary by default and takes a tone on the fill only', () => {
    const plain = render(MetricBarFixture).container
    const bar = (container: HTMLElement) => container.querySelector('[data-slot="progress"]')
    expect(bar(plain)).toHaveClass('[&_[data-slot=progress-indicator]]:bg-primary')
    const critical = render(MetricBarFixture, { tone: 'critical' }).container
    expect(bar(critical)).toHaveClass('[&_[data-slot=progress-indicator]]:bg-destructive')
  })

  it('clamps the bar to 0–100', () => {
    render(MetricBarFixture, { percent: 140 })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('draws an icon chip or a rank before the label', () => {
    const withIcon = render(MetricBarFixture, { withIcon: true }).container
    expect(withIcon.querySelector('[data-slot="icon-chip"]')).toHaveClass('size-10')
    const ranked = render(MetricBarFixture, { rank: 2 }).container
    expect(ranked.querySelector('[data-slot="metric-rank"]')).toHaveTextContent('2')
  })
})

describe('MetricRank', () => {
  it('is a small muted circle with the number in it', () => {
    const { container } = render(MetricRank, { rank: 3 })
    const rank = container.querySelector('[data-slot="metric-rank"]')
    expect(rank).toHaveTextContent('3')
    expect(rank).toHaveClass('size-6', 'rounded-full', 'bg-foreground/[0.07]', 'tabular-nums')
  })
})
