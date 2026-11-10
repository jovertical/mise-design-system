import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import CardGridList from './fixtures/card-grid-list.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('CardGrid', () => {
  it('is one column on a phone and three from md by default', () => {
    const { container } = render(CardGridList, { kind: 'grid' })

    expect(slot(container, 'card-grid')).toHaveClass('grid', 'gap-4', 'md:grid-cols-3')
  })

  it('takes two or four columns from md', () => {
    const two = render(CardGridList, { kind: 'grid', columns: 2 }).container

    expect(slot(two, 'card-grid')).toHaveClass('md:grid-cols-2')

    const four = render(CardGridList, { kind: 'grid', columns: 4 }).container

    expect(slot(four, 'card-grid')).toHaveClass('md:grid-cols-4')
  })

  it('draws each cell bordered, lighter than a card', () => {
    const { container } = render(CardGridList, { kind: 'grid' })
    const cells = container.querySelectorAll('[data-slot="card-grid-cell"]')

    expect(cells).toHaveLength(2)
    expect(cells[0]).toHaveClass('rounded-lg', 'border', 'p-4')
  })
})

describe('CardList', () => {
  it('cancels the card padding and hands it back to each row', () => {
    const { container } = render(CardGridList, { kind: 'list' })
    const list = slot(container, 'card-list')

    expect(list).toHaveClass('-mx-(--card-spacing)', 'divide-y', '[&>*]:px-(--card-spacing)')
    expect(list).toHaveClass('[&>[data-slot]+[data-slot]]:border-t-border')
  })

  it('pads rows for two lines by default, and for one when compact', () => {
    const roomy = render(CardGridList, { kind: 'list' }).container

    expect(slot(roomy, 'card-list')).toHaveClass('[&>*]:py-4')

    const compact = render(CardGridList, { kind: 'list', compact: true }).container

    expect(slot(compact, 'card-list')).toHaveClass('[&>*]:py-2.5')
    expect(slot(compact, 'card-list')).not.toHaveClass('[&>*]:py-4')
  })
})
