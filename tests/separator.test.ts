import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Separator } from '../src/lib/index.js'

const separator = (container: HTMLElement) =>
  container.querySelector('[data-slot="separator"]') as HTMLElement

describe('Separator', () => {
  it('is a decorative horizontal rule by default', () => {
    const element = separator(render(Separator).container)

    expect(element).toHaveAttribute('data-orientation', 'horizontal')
    expect(element).toHaveAttribute('role', 'none')
    expect(element).toHaveClass('bg-border')
  })

  it('is announced as a separator when it is not decorative', () => {
    const element = separator(
      render(Separator, { orientation: 'vertical', decorative: false }).container,
    )

    expect(element).toHaveAttribute('data-orientation', 'vertical')
    expect(element).toHaveAttribute('role', 'separator')
    expect(element).toHaveAttribute('aria-orientation', 'vertical')
  })

  it("lets a caller set a vertical rule's height, stretching to its row otherwise", () => {
    const element = separator(
      render(Separator, { orientation: 'vertical', class: 'h-4' }).container,
    )

    expect(element).toHaveClass('h-4', 'data-[orientation=vertical]:self-stretch')
    expect(element).not.toHaveClass('data-[orientation=vertical]:h-full')
  })
})
