import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import TableFixture from './fixtures/table.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('Table', () => {
  it('is a table in a scrolling container, with every part slotted', () => {
    const { container } = render(TableFixture)

    expect(slot(container, 'table-container')).toHaveClass('overflow-x-auto')
    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'default')

    for (const part of [
      'table-header',
      'table-body',
      'table-footer',
      'table-row',
      'table-caption',
    ]) {
      expect(slot(container, part), part).not.toBeNull()
    }

    expect(slot(container, 'table-row')).toHaveClass('data-[state=selected]:bg-accent')
  })

  it('sets the row height on every head and cell from the table', () => {
    const roomy = render(TableFixture).container

    expect(slot(roomy, 'table-head')).toHaveClass('h-11')
    expect(slot(roomy, 'table-cell')).toHaveClass('py-3.5')

    const compact = render(TableFixture, { compact: true }).container

    expect(screen.getAllByRole('table')[1]).toHaveAttribute('data-density', 'compact')
    expect(slot(compact, 'table-head')).toHaveClass('h-9')
    expect(slot(compact, 'table-cell')).toHaveClass('py-2.5')
  })

  it('right-aligns a numeric column, with tabular figures in its cells', () => {
    render(TableFixture)

    expect(screen.getByText('Qty')).toHaveClass('text-right')
    expect(screen.getAllByText('12')[0]).toHaveClass('text-right', 'tabular-nums')
  })

  it('sets a strong header in ink at body size', () => {
    render(TableFixture)

    expect(screen.getByText('Item')).toHaveClass('text-foreground', 'text-sm', 'font-semibold')
  })
})
