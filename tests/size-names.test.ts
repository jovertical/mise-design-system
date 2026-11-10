import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import SizeNamesHarness from './fixtures/size-names-harness.svelte'

const classesOf = (container: HTMLElement, slot: string) =>
  (container.querySelector(`[data-slot="${slot}"]`) as HTMLElement).className

// `md` is mise's name for the middle size; where a component's own name was
// `default`, both draw the same.
describe('size names', () => {
  it.each(['toggle', 'toggle-group-item', 'sidebar-menu-button'])(
    '%s draws md as it draws default',
    (slot) => {
      const md = render(SizeNamesHarness, { size: 'md' })
      const mdClasses = classesOf(md.container, slot)

      const mdSize = (md.container.querySelector(`[data-slot="${slot}"]`) as HTMLElement).dataset
        .size

      md.unmount()

      const fallback = render(SizeNamesHarness, { size: 'default' })

      const fallbackSize = (
        fallback.container.querySelector(`[data-slot="${slot}"]`) as HTMLElement
      ).dataset.size

      expect(mdClasses).toBe(classesOf(fallback.container, slot))
      expect(mdSize).toBe(fallbackSize)
    },
  )
})
