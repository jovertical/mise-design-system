import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { DeltaBadge } from '../src/lib/index.js'

const badge = (container: HTMLElement) =>
  container.querySelector('[data-slot="delta-badge"]') as HTMLElement

describe('DeltaBadge', () => {
  it('signs a rise, tints it success, and draws the up trend', () => {
    const { container } = render(DeltaBadge, { value: 6.4 })

    expect(badge(container)).toHaveTextContent('+6.4%')
    expect(badge(container)).toHaveClass('rounded-full', 'bg-success-soft')
    expect(badge(container).querySelector('svg')).toHaveClass('lucide-trending-up')
  })

  it('tints a fall critical, and a zero flat and neutral', () => {
    const fall = render(DeltaBadge, { value: -2.8 }).container

    expect(badge(fall)).toHaveTextContent('-2.8%')
    expect(badge(fall).querySelector('svg')).toHaveClass('lucide-trending-down')

    const flat = render(DeltaBadge, { value: 0 }).container

    expect(badge(flat)).toHaveTextContent('0.0%')
    expect(badge(flat).querySelector('svg')).toHaveClass('lucide-minus')
    expect(badge(flat)).not.toHaveClass('bg-success-soft')
  })

  it('flips the colour, never the arrow, when inverted', () => {
    const { container } = render(DeltaBadge, { value: -2.8, invert: true })

    expect(badge(container)).toHaveClass('bg-success-soft')
    expect(badge(container).querySelector('svg')).toHaveClass('lucide-trending-down')
  })

  it('takes a unit, a prefix after the sign, and a precision', () => {
    render(DeltaBadge, { value: -1.4, prefix: '$', unit: '', precision: 2 })

    expect(screen.getByText(/-\$1\.40/)).toBeInTheDocument()
  })

  it('drops the pill for plain, keeping the tone on the text', () => {
    const { container } = render(DeltaBadge, { value: 6.4, variant: 'plain' })

    expect(badge(container)).not.toHaveClass('rounded-full')
    expect(badge(container)).toHaveClass('text-success')
  })
})
