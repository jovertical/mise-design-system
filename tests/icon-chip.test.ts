import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { IconChip } from '../src/lib/index.js'
import { text } from './snippet.js'

const chip = (container: HTMLElement) =>
  container.querySelector('[data-slot="icon-chip"]') as HTMLElement

describe('IconChip', () => {
  it('is a small neutral squircle by default', () => {
    const el = chip(render(IconChip, { children: text('▣') }).container)

    expect(el).toHaveAttribute('data-tone', 'neutral')
    expect(el).toHaveClass('size-8', 'rounded-lg', 'bg-foreground/[0.07]', 'text-muted-foreground')
  })

  it('steps the square radius with the size', () => {
    expect(chip(render(IconChip, { size: 'md' }).container)).toHaveClass('size-10', 'rounded-xl')
  })

  it('draws a circle, and a tone from the soft wash', () => {
    const el = chip(render(IconChip, { shape: 'circle', tone: 'success' }).container)

    expect(el).toHaveClass('rounded-full', 'bg-success-soft', 'text-success')
    expect(el).not.toHaveClass('rounded-lg')
  })
})
