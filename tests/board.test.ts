import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import BoardDragHarness from './fixtures/board-drag-harness.svelte'
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

describe('Board dragging', () => {
  it('adds nothing to a board without onMove', () => {
    const { container } = render(BoardDragHarness, { readonly: true })

    expect(container.querySelector('[data-slot="board-live"]')).toBeNull()

    expect(container.querySelector('[data-slot="board-card"]')).not.toHaveAttribute(
      'aria-roledescription',
    )
  })

  it('marks cards draggable and tells a screen reader how', () => {
    render(BoardDragHarness)

    const card = screen.getByRole('link', { name: /OR-2060/ })

    expect(card).toHaveAttribute('aria-roledescription', 'draggable card')
    expect(card).toHaveAttribute('aria-describedby')
  })

  it('moves a card with the keyboard and reports the move', async () => {
    render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2060/ }).focus()

    await userEvent.keyboard(' ')

    expect(screen.getByRole('link', { name: /OR-2060/ })).toHaveAttribute('data-held')

    await userEvent.keyboard('{ArrowRight} ')

    expect(screen.getByTestId('moves')).toHaveTextContent(
      JSON.stringify([{ id: 'or-2060', from: 'received', to: 'ready' }]),
    )
  })

  it('shows which columns take the held card, and refuses the rest', async () => {
    const { container } = render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2053/ }).focus()

    await userEvent.keyboard(' ')

    const columns = [...container.querySelectorAll('[data-slot="board-column"]')]

    expect(columns.map((column) => column.getAttribute('data-drop'))).toEqual([
      'refuses',
      null,
      'accepts',
    ])

    await userEvent.keyboard('{ArrowLeft} ')

    expect(screen.getByTestId('moves')).toHaveTextContent('[]')

    expect(container.querySelector('[data-slot="board-live"]')).toHaveTextContent(
      'Received does not accept OR-2053',
    )
  })

  it('keeps a card that is a link a link, held or not', async () => {
    render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2060/ }).focus()

    await userEvent.keyboard(' ')

    const card = screen.getByRole('link', { name: /OR-2060/ })

    expect(card).toHaveAttribute('data-held')
    expect(card).not.toHaveAttribute('aria-pressed')
  })

  it('scrolls a long column under its header', () => {
    const { container } = render(BoardDragHarness)
    const [column] = container.querySelectorAll('[data-slot="board-column"]')

    expect(column).toHaveClass('min-h-0', 'max-h-full')

    // Room on every side for a card's focus ring, and a gutter for the scrollbar.
    expect(column.querySelector('[data-slot="board-column-cards"]')).toHaveClass(
      'min-h-0',
      'overflow-y-auto',
      'p-1.5',
      '[scrollbar-gutter:stable]',
    )
  })

  it('rings a column that takes the held card, fades one that refuses, and fades the card', async () => {
    const { container } = render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2053/ }).focus()

    await userEvent.keyboard(' ')

    const [received, , cancelled] = container.querySelectorAll('[data-slot="board-column"]')

    // Inset, so the board's sideways-scrolling row cannot clip it.
    expect(cancelled).toHaveClass('data-[drop=accepts]:ring-2', 'data-[drop=accepts]:ring-inset')
    expect(received).toHaveClass('data-[drop=refuses]:opacity-50')
    expect(screen.getByRole('link', { name: /OR-2053/ })).toHaveClass('data-[held]:opacity-50')
  })

  it('cancels on Escape', async () => {
    render(BoardDragHarness)

    screen.getByRole('link', { name: /OR-2060/ }).focus()

    await userEvent.keyboard(' {ArrowRight}{Escape}')

    expect(screen.getByTestId('moves')).toHaveTextContent('[]')
  })
})
