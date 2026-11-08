import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import StatTileFixture from './fixtures/stat-tile.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('StatTile', () => {
  it('is a raised card with the caption above the figure, at md by default', () => {
    const { container } = render(StatTileFixture)
    expect(slot(container, 'card')).toHaveClass('shadow-md', 'gap-0')
    expect(screen.getByText('On hand')).toHaveClass('text-sm', 'font-medium')
    expect(screen.getByText('147')).toHaveClass(
      'font-heading',
      'font-bold',
      'text-2xl',
      'tabular-nums',
    )
  })

  it('names the density with size and colours the figure, never the chip, with tone', () => {
    const { container } = render(StatTileFixture, { size: 'lg', tone: 'critical', withIcon: true })
    expect(screen.getByText('147')).toHaveClass('text-3xl', 'text-destructive')
    expect(slot(container, 'icon-chip')).toHaveAttribute('data-tone', 'neutral')
  })

  it('lets the chip follow tone only when asked, over iconTone', () => {
    const { container } = render(StatTileFixture, {
      tone: 'critical',
      iconTone: 'info',
      applyToneToIcon: true,
      withIcon: true,
    })
    expect(slot(container, 'icon-chip')).toHaveAttribute('data-tone', 'critical')
  })

  it('puts the chip on the right by default and on the left when asked', () => {
    const right = render(StatTileFixture, { withIcon: true }).container
    const row = slot(right, 'icon-chip').parentElement as HTMLElement
    expect(row.lastElementChild).toBe(slot(right, 'icon-chip'))
    const left = render(StatTileFixture, { withIcon: true, iconPosition: 'left' }).container
    expect((slot(left, 'icon-chip').parentElement as HTMLElement).firstElementChild).toBe(
      slot(left, 'icon-chip'),
    )
  })

  it('sets the delta beside the figure and the unit and description under it', () => {
    render(StatTileFixture, { withDelta: true, unit: 'orders', description: 'Lifetime' })
    expect(screen.getByTestId('delta').parentElement).toBe(screen.getByText('147').parentElement)
    expect(screen.getByText('orders')).toHaveClass('text-xs', 'text-muted-foreground')
    expect(screen.getByText('Lifetime')).toHaveClass('mt-1', 'text-xs')
  })

  it('puts the exact figure on hover only when there is a figure', () => {
    render(StatTileFixture, { value: '$45.6k', exactValue: '$45,612.40' })
    expect(screen.getByText('$45.6k')).toHaveAttribute('title', '$45,612.40')
  })

  it('draws a skeleton while loading, keeping the height', () => {
    const { container } = render(StatTileFixture, { loading: true, size: 'lg' })
    expect(slot(container, 'skeleton')).toHaveClass('h-9', 'w-24')
    expect(screen.queryByText('147')).toBeNull()
  })

  it('shows an em dash on error, drops the delta, and blanks the rows', () => {
    render(StatTileFixture, {
      error: true,
      withDelta: true,
      exactValue: '147.0',
      rows: [{ id: 'in', label: 'Stock in', value: '+910', tone: 'success' }],
    })
    expect(screen.getAllByText('—')).toHaveLength(2)
    expect(screen.queryByTestId('delta')).toBeNull()
    expect(screen.getAllByText('—')[0]).not.toHaveAttribute('title')
  })

  it('rules each row above it in a valid fact list, tone on the value', () => {
    const { container } = render(StatTileFixture, {
      rows: [
        { id: 'in', label: 'Stock in', value: '+910', tone: 'success' },
        { id: 'out', label: 'Stock out', value: '-87', tone: 'critical' },
      ],
    })
    const list = slot(container, 'fact-list')
    expect(list.tagName).toBe('DL')
    const items = list.querySelectorAll('[data-slot="fact-list-item"]')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveClass('border-t', 'pt-3')
    expect(list.querySelector('[data-slot="separator"]')).toBeNull()
    expect(screen.getByText('+910')).toHaveClass('text-success')
  })

  it('recesses into its card as an inset, caption small and upper-case', () => {
    const { container } = render(StatTileFixture, { surface: 'inset' })
    expect(slot(container, 'card')).toBeNull()
    expect(slot(container, 'stat-tile')).toHaveClass('bg-muted/40', 'rounded-xl', 'border')
    expect(screen.getByText('On hand').parentElement).toHaveClass('uppercase', 'text-xs')
  })

  it('sets the action on the label line', () => {
    render(StatTileFixture, { withAction: true })
    const action = screen.getByTestId('action').parentElement as HTMLElement
    expect(action.parentElement).toBe(screen.getByText('On hand').parentElement?.parentElement)
  })
})
