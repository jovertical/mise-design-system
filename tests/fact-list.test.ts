import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import FactListFixture from './fixtures/fact-list.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('FactList', () => {
  it('is a dl whose items are a div around a dt and a dd', () => {
    const { container } = render(FactListFixture)
    const list = slot(container, 'fact-list')
    expect(list.tagName).toBe('DL')
    expect(list).toHaveClass('flex', 'flex-col', 'gap-2')
    const item = slot(container, 'fact-list-item')
    expect(item.tagName).toBe('DIV')
    expect([...item.children].map((child) => child.tagName)).toEqual(['DT', 'DD'])
  })

  it('tightens to gap-1 when compact', () => {
    const { container } = render(FactListFixture, { compact: true })
    expect(slot(container, 'fact-list')).toHaveClass('gap-1')
  })
})

describe('FactListItem', () => {
  it('puts the label left and the value right by default', () => {
    const { container } = render(FactListFixture)
    const item = slot(container, 'fact-list-item')
    expect(item).toHaveAttribute('data-orientation', 'horizontal')
    expect(item).toHaveClass('flex', 'items-baseline', 'justify-between')
    expect(screen.getByText('Riverside')).toHaveClass('text-right', 'tabular-nums', 'text-success')
  })

  it('stacks the label above the value when vertical, and truncates it', () => {
    const { container } = render(FactListFixture, { orientation: 'vertical' })
    const item = slot(container, 'fact-list-item')
    expect(item).toHaveAttribute('data-orientation', 'vertical')
    expect(item).toHaveClass('flex-col')
    expect(screen.getByText('Location')).toHaveClass('text-xs', 'text-muted-foreground')
    expect(screen.getByText('Riverside')).toHaveClass('truncate')
  })

  it('lets a vertical value wrap when multiline', () => {
    render(FactListFixture, { orientation: 'vertical', multiline: true })
    expect(screen.getByText('Riverside')).not.toHaveClass('truncate')
  })

  it('draws the icon chip inside the term, and only when vertical', () => {
    const vertical = render(FactListFixture, { orientation: 'vertical', withIcon: true }).container
    const chip = slot(vertical, 'icon-chip')
    expect(chip.closest('dt')).not.toBeNull()
    expect(slot(vertical, 'fact-list-item')).toHaveClass('pl-11')
    const horizontal = render(FactListFixture, { withIcon: true }).container
    expect(slot(horizontal, 'icon-chip')).toBeNull()
  })

  it('renders an em dash for a missing value', () => {
    render(FactListFixture, { value: null })
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
