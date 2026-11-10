import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import CardComposition from './fixtures/card-composition.svelte'
import SupplierTitle from './fixtures/supplier-title.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

const PARTS = [
  'card-header',
  'card-title',
  'card-description',
  'card-action',
  'card-content',
  'card-footer',
]

describe('Card', () => {
  it('renders every part with its data-slot, nested as composed', () => {
    const { container } = render(CardComposition)
    const card = slot(container, 'card')

    for (const part of PARTS) expect(card.contains(slot(container, part)), part).toBe(true)

    expect(slot(container, 'card-title')).toHaveTextContent('Morning shift')
  })

  it('defaults to the raised surface and merges a caller class', () => {
    const card = slot(render(CardComposition).container, 'card')

    expect(card).toHaveAttribute('data-variant', 'default')
    expect(card).toHaveClass('bg-card', 'shadow-sm', 'extra-card')
  })

  it('drops the surface for the ghost variant', () => {
    const card = slot(render(CardComposition, { variant: 'ghost' }).container, 'card')

    expect(card).toHaveClass('bg-transparent', 'shadow-none')
    expect(card).not.toHaveClass('bg-card')
  })

  it('draws the header rule only when divided', () => {
    expect(slot(render(CardComposition).container, 'card-header')).not.toHaveClass('border-b')

    const divided = slot(render(CardComposition, { divided: true }).container, 'card-header')

    expect(divided).toHaveClass('border-b')
  })

  it('stacks content at the named gap', () => {
    const content = slot(render(CardComposition, { stack: 'md' }).container, 'card-content')

    expect(content).toHaveAttribute('data-stack', 'md')
    expect(content).toHaveClass('flex', 'flex-col', 'gap-4')
  })

  it('marks a bleed footer and a muted footer', () => {
    const bleed = slot(render(CardComposition, { bleed: true }).container, 'card-footer')

    expect(bleed).toHaveAttribute('data-bleed', 'true')

    const muted = slot(render(CardComposition, { footerVariant: 'muted' }).container, 'card-footer')

    expect(muted).toHaveAttribute('data-variant', 'muted')
    expect(muted).toHaveClass('bg-muted/40')
  })
})

describe('CardTitle with an icon', () => {
  it('draws a bare, muted glyph by default', () => {
    const { container } = render(SupplierTitle)
    const title = screen.getByText('Supplier information')

    expect(title).toHaveAttribute('data-slot', 'card-title')
    expect(container.querySelector('[data-slot="icon-chip"]')).toBeNull()
    expect(container.querySelector('svg')?.parentElement).toHaveClass('text-muted-foreground')
  })

  it('puts the glyph in a tinted chip when given a tone', () => {
    const { container } = render(SupplierTitle, { iconTone: 'primary' })
    const chip = container.querySelector('[data-slot="icon-chip"]')

    expect(chip).toHaveAttribute('data-tone', 'primary')
    expect(chip).toContainElement(container.querySelector('svg'))
  })
})
