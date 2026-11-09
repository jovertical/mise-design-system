import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import BoardHarness from './fixtures/board-harness.svelte'

const slots = (container: HTMLElement, name: string) =>
  [...container.querySelectorAll(`[data-slot="${name}"]`)] as HTMLElement[]

describe('Board', () => {
  it('lays columns out in a row that scrolls rather than squeezes', () => {
    const { container } = render(BoardHarness)
    const [board] = slots(container, 'board')
    expect(board).toHaveClass('flex', 'overflow-x-auto')
    const columns = slots(container, 'board-column')
    expect(columns).toHaveLength(3)
    expect(columns[0]).toHaveClass('w-72', 'shrink-0')
  })

  it('heads each column with its title, count and a tone dot', () => {
    const { container } = render(BoardHarness)
    const [first] = slots(container, 'board-column')
    expect(first).toHaveTextContent('Received')
    expect(first.querySelector('[data-slot="board-column-count"]')).toHaveTextContent('2')
    expect(first.querySelector('[data-slot="board-column-dot"]')).toHaveClass('bg-info')
  })

  it('labels the column region by its title', () => {
    render(BoardHarness)
    expect(screen.getByRole('region', { name: 'Received' })).toBeInTheDocument()
  })

  it('says so when a column has no cards', () => {
    const { container } = render(BoardHarness)
    const ready = slots(container, 'board-column')[1]
    expect(ready).toHaveTextContent('No orders ready')
    expect(slots(ready, 'board-card')).toHaveLength(0)
  })

  it('renders a card as a link when it has an href', () => {
    render(BoardHarness)
    const link = screen.getByRole('link', { name: /OR-2054/ })
    expect(link).toHaveAttribute('href', '/orders/OR-2054')
    expect(link).toHaveAttribute('data-slot', 'board-card')
  })

  it('renders a column title snippet and actions', () => {
    render(BoardHarness)
    expect(screen.getByRole('button', { name: 'Show all' })).toBeInTheDocument()
  })

  it('defaults to a neutral dot', () => {
    const { container } = render(BoardHarness)
    const completed = slots(container, 'board-column')[2]
    expect(completed.querySelector('[data-slot="board-column-dot"]')).toHaveClass(
      'bg-muted-foreground',
    )
  })
})
