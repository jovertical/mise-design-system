import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import TreeLeafHarness from './fixtures/tree-leaf-harness.svelte'

const part = (row: HTMLElement, slot: string) =>
  row.querySelector(`[data-slot="tree-leaf-${slot}"]`)

describe('TreeLeaf', () => {
  it('runs the stem full height, and half height on the last row', () => {
    render(TreeLeafHarness)
    const [first, last] = screen.getAllByRole('listitem')
    expect(part(first, 'stem')).toHaveClass('h-full')
    expect(last).toHaveAttribute('data-position', 'last')
    expect(part(last, 'stem')).toHaveClass('h-1/2')
    expect(part(first, 'elbow')).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws media, a truncating label and an optional trailing figure', () => {
    render(TreeLeafHarness)
    const [first, last] = screen.getAllByRole('listitem')
    expect(part(first, 'media')).toContainElement(screen.getAllByTestId('icon')[0])
    expect(part(first, 'label')).toHaveClass('min-w-0', 'flex-1', 'truncate')
    expect(part(first, 'trailing')).toHaveTextContent('250 g')
    expect(part(last, 'trailing')).toBeNull()
  })

  it.each([
    ['md', 'size-8'],
    ['sm', 'size-6'],
  ] as const)('sizes the media at %s', (mediaSize, size) => {
    render(TreeLeafHarness, { mediaSize })
    expect(part(screen.getAllByRole('listitem')[0], 'media')).toHaveClass(size)
  })
})
