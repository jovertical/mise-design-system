import { describe, expect, it, vi } from 'vitest'

import { BoardDrag } from '../src/lib/components/data-display/board/board-drag.svelte.js'

function board() {
  const onMove = vi.fn()
  const drag = new BoardDrag(onMove)

  drag.register('received', { title: 'Received', accepts: () => false })

  drag.register('ready', { title: 'Ready', accepts: (card) => card.from === 'received' })

  drag.register('cancelled', { title: 'Cancelled' })

  return { drag, onMove }
}

const card = { id: 'or-2060', from: 'received' }

describe('BoardDrag', () => {
  it('reports an accepted drop, and nothing else', () => {
    const { drag, onMove } = board()

    expect(drag.drop(card, 'ready', 'OR-2060')).toBe(true)
    expect(onMove).toHaveBeenCalledWith({ id: 'or-2060', from: 'received', to: 'ready' })
  })

  it('refuses a drop on the card’s own column or a column that does not accept it', () => {
    const { drag, onMove } = board()

    expect(drag.drop(card, 'received', 'OR-2060')).toBe(false)
    expect(drag.drop({ id: 'or-2053', from: 'ready' }, 'received', 'OR-2053')).toBe(false)
    expect(drag.message).toBe('Received does not accept OR-2053')
    expect(onMove).not.toHaveBeenCalled()
  })

  it('accepts a card from another column when the column gives no rule', () => {
    expect(board().drag.canDrop({ id: 'or-2053', from: 'ready' }, 'cancelled')).toBe(true)
  })

  it('steps a held card between columns and drops it, announcing each step', () => {
    const { drag, onMove } = board()

    drag.pickUp(card, 'OR-2060')

    expect(drag.message).toBe(
      'Picked up OR-2060. Left and Right move it, Space drops it, Escape cancels.',
    )

    drag.step(1)

    expect(drag.over).toBe('ready')
    expect(drag.message).toBe('Over Ready')

    drag.commit()

    expect(onMove).toHaveBeenCalledWith({ id: 'or-2060', from: 'received', to: 'ready' })
    expect(drag.held).toBeNull()
    expect(drag.message).toBe('Dropped OR-2060 in Ready')
  })

  it('stops at the ends, and cancels without moving', () => {
    const { drag, onMove } = board()

    drag.pickUp(card, 'OR-2060')

    drag.step(-1)

    expect(drag.over).toBe('received')

    drag.cancel()

    expect(drag.held).toBeNull()
    expect(drag.message).toBe('Cancelled. OR-2060 stays in Received')
    expect(onMove).not.toHaveBeenCalled()
  })

  it('forgets a column once it unregisters', () => {
    const { drag } = board()
    const unregister = drag.register('done', { title: 'Done' })

    unregister()

    expect(drag.canDrop(card, 'done')).toBe(false)
  })
})
