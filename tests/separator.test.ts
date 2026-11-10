import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Separator } from '../src/lib/index.js'

const separator = (container: HTMLElement) =>
  container.querySelector('[data-slot="separator"]') as HTMLElement

describe('Separator', () => {
  it('is a decorative horizontal rule by default', () => {
    const el = separator(render(Separator).container)

    expect(el).toHaveAttribute('data-orientation', 'horizontal')
    expect(el).toHaveAttribute('role', 'none')
    expect(el).toHaveClass('bg-border')
  })

  it('is announced as a separator when it is not decorative', () => {
    const el = separator(
      render(Separator, { orientation: 'vertical', decorative: false }).container,
    )

    expect(el).toHaveAttribute('data-orientation', 'vertical')
    expect(el).toHaveAttribute('role', 'separator')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
  })
})
