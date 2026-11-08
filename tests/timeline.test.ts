import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { TimelineSkeleton } from '../src/lib/index.js'
import TimelineHarness from './fixtures/timeline-harness.svelte'

const dots = () => [...document.querySelectorAll('[data-slot="timeline-dot"]')] as HTMLElement[]

describe('Timeline', () => {
  it('is an ordered list of grid items', () => {
    render(TimelineHarness)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(list).toHaveClass('grid', '[&>li]:grid-cols-[0_min-content_1fr]')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('washes a status badge at 15%, solid primary by default', () => {
    render(TimelineHarness)
    expect(dots()[0]).toHaveClass('bg-destructive/15', 'text-destructive', 'size-8')
    expect(dots()[1]).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('draws its icon, or a small circle when given none', () => {
    render(TimelineHarness)
    expect(dots()[0]).toContainElement(screen.getByTestId('icon'))
    expect(dots()[1].querySelector('.size-2\\.5.rounded-full.bg-current')).not.toBeNull()
  })

  it('pins an indicator to the badge edge', () => {
    render(TimelineHarness)
    expect(dots()[0]).toHaveClass('relative')
    expect(dots()[0].lastElementChild).toHaveClass('absolute', 'right-0', 'bottom-0')
  })

  it('joins entries with a vertical connector in the badge column', () => {
    render(TimelineHarness)
    const connectors = document.querySelectorAll('[data-slot="timeline-connector"]')
    expect(connectors).toHaveLength(1)
    expect(connectors[0]).toHaveAttribute('aria-orientation', 'vertical')
    expect(connectors[0]).toHaveClass('col-start-2', 'row-start-2', 'h-full', 'min-h-6')
  })
})

describe('TimelineSkeleton', () => {
  it('draws count neutral entries, with no connector under the last', () => {
    render(TimelineSkeleton, { count: 4 })
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(document.querySelectorAll('[data-slot="timeline-connector"]')).toHaveLength(3)
    expect(dots()[0]).toHaveClass('bg-foreground/[0.07]', 'animate-pulse')
    expect(document.querySelector('[data-slot="timeline-skeleton"]')).not.toBeNull()
  })
})
