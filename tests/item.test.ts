import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Item } from '../src/lib/index.js'
import ItemHarness from './fixtures/item-harness.svelte'
import { text } from './snippet.js'

const items = () => [...document.querySelectorAll('[data-slot="item"]')] as HTMLElement[]

describe('Item', () => {
  it('groups rows in a list', () => {
    render(ItemHarness)

    expect(screen.getByRole('list')).toHaveAttribute('data-slot', 'item-group')
    expect(document.querySelector('[data-slot="item-separator"]')).toHaveClass('my-0')
  })

  it.each([
    ['md', 'p-4'],
    ['sm', 'px-4'],
    ['flush', 'px-0'],
  ] as const)('pads a %s row', (size, padding) => {
    render(Item, { size, children: text('Row') })

    expect(items()[0]).toHaveClass(padding)
    expect(items()[0]).toHaveAttribute('data-size', size)
  })

  it.each([
    ['outline', 'border-border'],
    ['muted', 'bg-muted/50'],
  ] as const)('draws the %s variant', (variant, cls) => {
    render(Item, { variant, children: text('Row') })

    expect(items()[0]).toHaveClass(cls)
  })

  it('draws icon media as an IconChip chip, toned', () => {
    render(ItemHarness)

    const media = document.querySelector('[data-slot="item-media"]') as HTMLElement

    expect(media).toHaveAttribute('data-tone', 'warning')
    expect(media).toHaveClass('rounded-lg', 'text-warning')
  })

  it('renders a link row as an a, and a button row through child', () => {
    render(ItemHarness)

    expect(screen.getByRole('link', { name: 'Register 1' })).toHaveAttribute('data-slot', 'item')

    const button = screen.getByRole('button', { name: 'Open settings' })

    expect(button).toHaveAttribute('data-slot', 'item')
    expect(button).toHaveClass('[button]:w-full', '[button]:text-left')
  })

  it('lets a long title truncate', () => {
    render(ItemHarness)

    expect(document.querySelector('[data-slot="item-content"]')).toHaveClass('min-w-0', 'flex-1')
    expect(screen.getByText('Not seen for 3 days')).toHaveClass('line-clamp-2')
  })
})
