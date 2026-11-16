import { fireEvent, render, screen } from '@testing-library/svelte'
import { tick } from 'svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Anatomy from '../src/modules/docs/components/anatomy.svelte'
import AnatomyExample from './fixtures/anatomy-example.svelte'

const RECTS: Record<string, { x: number; y: number; width: number; height: number }> = {
  stage: { x: 0, y: 0, width: 600, height: 300 },
  'part-one': { x: 100, y: 100, width: 80, height: 40 },
  'part-two': { x: 400, y: 100, width: 80, height: 40 },
}

const ZERO = { x: 0, y: 0, width: 0, height: 0 }

function rectOf(element: Element) {
  const key = element.hasAttribute('data-anatomy-stage')
    ? 'stage'
    : (element.getAttribute('data-slot') ?? '')

  const rect = RECTS[key] ?? ZERO

  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height,
    toJSON: () => rect,
  } as DOMRect
}

beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this)
  })

  vi.spyOn(console, 'error').mockImplementation(() => {})
})

const example = { component: AnatomyExample, source: '', html: '' }

const parts = [
  { slot: 'part-one', label: 'First', part: 'PartOne' },
  { slot: 'part-two', label: 'Second' },
  { slot: 'part-gone', label: 'Gone' },
]

describe('Anatomy', () => {
  it('draws a marker for each part it finds and reports the one it does not', async () => {
    const { container } = render(Anatomy, { example, parts })

    await tick()

    expect(container.querySelectorAll('[data-anatomy-marker]')).toHaveLength(2)

    expect(container.querySelector('[data-anatomy-missing="part-gone"]')).not.toBeNull()

    const stage = container.querySelector('[data-anatomy-stage]')

    expect(stage?.getAttribute('data-anatomy-count')).toBe('3')
  })

  it('outlines a part while its legend row is hovered', async () => {
    const { container } = render(Anatomy, { example, parts })

    await tick()

    await fireEvent.mouseEnter(screen.getByText('First').closest('li') as HTMLElement)

    const outline = container.querySelector<HTMLElement>('[data-anatomy-outline]')

    expect(outline?.style.left).toBe('100px')

    expect(outline?.style.width).toBe('80px')
  })

  it('links a legend row to its part API table', () => {
    render(Anatomy, { example, parts })

    expect(screen.getByRole('link', { name: 'PartOne' }).getAttribute('href')).toBe('#api-part-one')
  })
})
