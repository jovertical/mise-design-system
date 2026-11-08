import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { MetricGrid } from '../src/lib/index.js'

const items = [
  { id: 'a', label: 'Breads', description: '12 items', percent: 28, trailing: '28%' },
  { id: 'b', label: 'Drinks', percent: 19, value: '19 / 100', tone: 'warning' as const },
]

describe('MetricGrid', () => {
  it('is a CardGrid with a MetricBar in each cell', () => {
    const { container } = render(MetricGrid, { items })
    expect(container.querySelector('[data-slot="card-grid"]')).toHaveClass('md:grid-cols-3')
    const cells = container.querySelectorAll('[data-slot="card-grid-cell"]')
    expect(cells).toHaveLength(2)
    expect(cells[0].querySelector('[data-slot="metric-bar"]')).not.toBeNull()
    expect(screen.getByText('12 items')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Drinks: 19%' })).toHaveClass(
      '[&_[data-slot=progress-indicator]]:bg-warning',
    )
  })

  it('takes two columns', () => {
    const { container } = render(MetricGrid, { items, columns: 2 })
    expect(container.querySelector('[data-slot="card-grid"]')).toHaveClass('md:grid-cols-2')
  })
})
