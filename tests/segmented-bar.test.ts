import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { SegmentedBar } from '../src/lib/index.js'

const segments = [
  { label: 'Adequate', value: 80, tone: 'success' as const },
  { label: 'Low', value: 16, tone: 'warning' as const },
  { label: 'Out', value: 4, tone: 'critical' as const },
]

const fills = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-slot="segmented-bar-segment"]')] as HTMLElement[]

describe('SegmentedBar', () => {
  it('sizes each segment by its share of the total, in its tone', () => {
    const { container } = render(SegmentedBar, { segments })
    const [adequate, low, out] = fills(container)

    expect(adequate.style.width).toBe('80%')
    expect(low.style.width).toBe('16%')
    expect(adequate).toHaveClass('bg-success')
    expect(out).toHaveAttribute('title', 'Out: 4')
  })

  it('prints a share only where it fits, from 6% up', () => {
    render(SegmentedBar, { segments })

    expect(screen.getByText('80.0%')).toBeInTheDocument()
    expect(screen.getByText('16.0%')).toBeInTheDocument()
    expect(screen.queryByText('4.0%')).toBeNull()
  })

  it('captions each segment above it, unless told not to', () => {
    render(SegmentedBar, { segments })

    expect(screen.getByText('Adequate')).toHaveClass('truncate')

    const bare = render(SegmentedBar, { segments, showLabels: false, showShare: false })

    expect(bare.container.textContent?.trim()).toBe('')
  })

  it('draws the neutral segment as the track, receding', () => {
    const { container } = render(SegmentedBar, { segments: [{ label: 'Rest', value: 1 }] })

    expect(fills(container)[0]).toHaveClass('bg-muted')
  })

  it('drops captions and shares at the slim size', () => {
    const { container } = render(SegmentedBar, { segments, size: 'sm' })

    expect(container.querySelector('[data-slot="segmented-bar"]')?.textContent?.trim()).toBe('')
    expect(container.querySelector('.h-2.rounded-full')).not.toBeNull()
  })

  it('draws an empty track when nothing is counted', () => {
    const { container } = render(SegmentedBar, { segments: [{ label: 'Adequate', value: 0 }] })

    expect(fills(container)).toHaveLength(0)
    expect(container.querySelector('[data-slot="segmented-bar"]')).toHaveClass('bg-muted')
  })
})
