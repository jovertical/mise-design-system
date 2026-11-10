import { render, screen } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { NavigationProgress } from '../src/lib/index.js'

const bar = () => screen.queryByRole('progressbar')
const fill = () => bar()?.firstElementChild as HTMLElement

describe('NavigationProgress', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => vi.useRealTimers())

  it('is absent until a navigation starts', () => {
    render(NavigationProgress, { pending: false })

    expect(bar()).toBeNull()
  })

  it('jumps to two thirds and waits there while pending', async () => {
    const { rerender } = render(NavigationProgress, { pending: false })

    await rerender({ pending: true })

    expect(bar()).toHaveAttribute('aria-valuenow', '0')

    await vi.advanceTimersByTimeAsync(1)

    expect(bar()).toHaveAttribute('aria-valuenow', '65')
    expect(fill()).toHaveStyle({ width: '65%' })

    await vi.advanceTimersByTimeAsync(5000)

    expect(bar()).toHaveAttribute('aria-valuenow', '65')
  })

  it('runs to full and hides when the navigation resolves', async () => {
    const { rerender } = render(NavigationProgress, { pending: false })

    await rerender({ pending: true })

    await vi.advanceTimersByTimeAsync(1)

    await rerender({ pending: false })

    expect(bar()).toHaveAttribute('aria-valuenow', '100')

    await vi.advanceTimersByTimeAsync(200)

    expect(bar()).toBeNull()
  })

  it('still flashes full for a navigation that resolves at once', async () => {
    const { rerender } = render(NavigationProgress, { pending: false })

    await rerender({ pending: true })

    await rerender({ pending: false })

    expect(bar()).toHaveAttribute('aria-valuenow', '100')

    await vi.advanceTimersByTimeAsync(200)

    expect(bar()).toBeNull()
  })
})
