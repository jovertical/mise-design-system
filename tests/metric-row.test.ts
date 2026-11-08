import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import MetricRowFixture from './fixtures/metric-row.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('MetricRow', () => {
  it('captions each stat above its figure, tone on the figure only', () => {
    render(MetricRowFixture)
    expect(screen.getByText('Low stock')).toHaveClass('text-xs', 'text-muted-foreground')
    expect(screen.getByText('3')).toHaveClass('font-semibold', 'tabular-nums', 'text-warning')
    expect(screen.getByText('80%')).toHaveClass('text-foreground')
  })

  it('runs the bar the full width below the row by default', () => {
    const { container } = render(MetricRowFixture, { trailing: '398 / 500 units' })
    const bar = screen.getByRole('progressbar', { name: 'Riverside: 80%' })
    expect(bar.parentElement?.parentElement?.parentElement).toBe(slot(container, 'metric-row'))
    expect(screen.getByText('398 / 500 units')).toHaveClass('text-xs')
  })

  it('puts the bar inline before the stats, and holds a slot for trailing', () => {
    const { container } = render(MetricRowFixture, { barPlacement: 'inline', trailing: null })
    const bar = screen.getByRole('progressbar')
    expect(bar.parentElement).toHaveClass('w-24')
    expect(container.querySelector('.min-w-20')).not.toBeNull()
  })

  it('gives the slot up when trailing is left out', () => {
    const { container } = render(MetricRowFixture, { barPlacement: 'inline' })
    expect(container.querySelector('.min-w-20')).toBeNull()
  })

  it('hides the bar for a row with nothing to measure, and clamps otherwise', () => {
    render(MetricRowFixture, { hideBar: true })
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('clamps the bar to 0–100', () => {
    render(MetricRowFixture, { percent: 140 })
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })
})
