import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { SegmentedCode } from '../src/lib/index.js'

const KEY_GROUPS = [5, 4, 4, 4, 4, 4, 4]
const boxes = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-slot="segmented-code"] > span')].map((box) =>
    box.textContent?.trim(),
  )

describe('SegmentedCode', () => {
  it('splits the code into its groups, dropping hyphens and spaces', () => {
    const { container } = render(SegmentedCode, {
      value: '66G6D-ME70 21KJ-6JBF-N82M-AWQA-9VCV',
      groups: KEY_GROUPS,
    })
    expect(boxes(container)).toEqual(['66G6D', 'ME70', '21KJ', '6JBF', 'N82M', 'AWQA', '9VCV'])
  })

  it('leaves the trailing boxes short or empty for a short value', () => {
    const { container } = render(SegmentedCode, { value: 'K7Q', groups: [2, 2, 2] })
    expect(boxes(container)).toEqual(['K7', 'Q', ''])
  })

  it.each([
    ['sm', 'h-9', 'px-2'],
    ['md', 'h-11', 'px-2.5'],
    ['lg', 'h-13', 'px-3'],
  ] as const)('sizes the strip and its boxes at %s', (size, height, padding) => {
    const { container } = render(SegmentedCode, { value: 'K7Q2XD', groups: [3, 3], size })
    const strip = container.querySelector('[data-slot="segmented-code"]') as HTMLElement
    expect(strip).toHaveClass(height, 'bg-muted', 'rounded-lg')
    expect(strip.firstElementChild).toHaveClass(padding, 'first:border-l-0')
  })
})
