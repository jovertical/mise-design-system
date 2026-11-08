import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { getPayloadConfigFromPayload } from '../src/lib/index.js'
import ChartFixture from './fixtures/chart.svelte'

describe('ChartContainer', () => {
  it('scopes the chart and writes each config colour for light and dark', () => {
    const { container } = render(ChartFixture)
    const chart = container.querySelector('[data-slot="chart"]') as HTMLElement
    expect(chart).toHaveAttribute('data-chart', 'chart-orders')
    expect(chart).toHaveTextContent('marks')
    const css = chart.querySelector('style')?.textContent ?? ''
    expect(css).toContain('[data-chart=chart-orders] {')
    expect(css).toContain('--color-completed: var(--chart-1);')
    expect(css).toContain('.dark [data-chart=chart-orders] {')
    expect(css).toContain('--color-placed: oklch(0.8 0.1 200);')
  })

  it('restyles LayerChart to quiet axes: no tick lines, muted tick labels', () => {
    const { container } = render(ChartFixture)
    expect(container.querySelector('[data-slot="chart"]')).toHaveClass(
      '[&_.lc-axis-tick]:stroke-0',
      '[&_.lc-axis-tick-label]:fill-muted-foreground',
    )
  })
})

describe('getPayloadConfigFromPayload', () => {
  it('finds a series config by its key', () => {
    const config = { completed: { label: 'Completed' } }
    const payload = { key: 'completed', label: 'completed', value: 3 } as never
    expect(getPayloadConfigFromPayload(config, payload, 'completed')).toEqual({
      label: 'Completed',
    })
  })
})
