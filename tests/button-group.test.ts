import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import ButtonGroupHarness from './fixtures/button-group-harness.svelte'

describe('ButtonGroup', () => {
  it('is a group that joins its children along a row by default', () => {
    render(ButtonGroupHarness)
    const group = screen.getByRole('group', { name: 'Range' })
    expect(group).toHaveAttribute('data-slot', 'button-group')
    expect(group).toHaveAttribute('data-orientation', 'horizontal')
    expect(group).toHaveClass('flex', 'w-fit', '[&>*:not(:first-child)]:rounded-l-none')
    expect(group).not.toHaveClass('flex-col')
  })

  // A shared edge is drawn by both neighbours, overlapping, rather than by one
  // of them, so a toned button's outline stays whole on every side.
  it('overlaps joined borders and raises a toned child above its neighbours', () => {
    render(ButtonGroupHarness)
    const group = screen.getByRole('group', { name: 'Range' })
    expect(group).toHaveClass(
      '[&>*:not(:first-child)]:-ml-px',
      '[&>[data-tone]:not([data-tone=neutral])]:z-[1]',
    )
    expect(group).not.toHaveClass('[&>*:not(:first-child)]:border-l-0')
  })

  it('stacks its children when vertical', () => {
    render(ButtonGroupHarness, { orientation: 'vertical' })
    const group = screen.getByRole('group', { name: 'Range' })
    expect(group).toHaveAttribute('data-orientation', 'vertical')
    expect(group).toHaveClass(
      'flex-col',
      '[&>*:not(:first-child)]:rounded-t-none',
      '[&>*:not(:first-child)]:-mt-px',
    )
  })

  it('carries a text part and a vertical separator', () => {
    render(ButtonGroupHarness)
    expect(screen.getByText('$')).toHaveAttribute('data-slot', 'button-group-text')
    expect(screen.getByText('$')).toHaveClass('bg-muted', 'rounded-md', 'border', 'px-4')
    const separator = document.querySelector('[data-slot="button-group-separator"]')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveClass('bg-input', 'self-stretch')
  })
})
