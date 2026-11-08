import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { EntityLabel } from '../src/lib/index.js'
import EntityLabelHarness from './fixtures/entity-label-harness.svelte'

describe('EntityLabel', () => {
  it('draws an icon in a chip, toned on request, beside a truncating name and line', () => {
    render(EntityLabelHarness, { iconTone: 'warning' })
    const chip = screen.getByTestId('glyph').closest('[data-slot="icon-chip"]') as HTMLElement
    expect(chip).toHaveClass('text-warning')
    expect(screen.getByText('cycle-count-sheet.pdf')).toHaveClass('truncate', 'font-medium')
    expect(screen.getByText('212 KB')).toHaveClass('truncate', 'text-muted-foreground')
  })

  it('takes media as given, and the icon over media when both come', () => {
    const { unmount } = render(EntityLabelHarness, { mode: 'media' })
    expect(screen.getByText('NC')).toBeInTheDocument()
    unmount()
    render(EntityLabelHarness, { mode: 'both' })
    expect(screen.getByTestId('glyph')).toBeInTheDocument()
    expect(screen.queryByText('NC')).toBeNull()
  })

  it('brings no padding, and can shrink inside a cell', () => {
    render(EntityLabel, { title: 'Espresso beans, 1 kg' })
    const root = document.querySelector('[data-slot="entity-label"]') as HTMLElement
    expect(root).toHaveClass('flex', 'min-w-0', 'gap-3')
    expect(root.className).not.toMatch(/\bp[xy]?-/)
  })
})
