import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Progress } from '../src/lib/index.js'

describe('Progress', () => {
  it('is a progressbar that reports its value', () => {
    render(Progress, { value: 64 })
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('data-slot', 'progress')
    expect(bar).toHaveAttribute('aria-valuenow', '64')
    expect(bar).toHaveClass('bg-muted', 'h-2', 'rounded-full')
  })

  it('slides the indicator in from the left by what is left to do', () => {
    const { container } = render(Progress, { value: 64 })
    const indicator = container.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(indicator).toHaveClass('bg-primary')
    expect(indicator.style.transform).toBe('translateX(-36%)')
  })

  it('reads a value against max, and an unknown value as empty', () => {
    const { container, rerender } = render(Progress, { value: 3, max: 4 })
    const indicator = () =>
      container.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(indicator().style.transform).toBe('translateX(-25%)')
    rerender({ value: undefined, max: 4 })
    expect(indicator().style.transform).toBe('translateX(-100%)')
  })
})
