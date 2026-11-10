import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import SiteHeaderHarness from './fixtures/site-header-harness.svelte'

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('SiteHeader', () => {
  it('is a sticky banner on a blurred band, holding its children in a card', () => {
    render(SiteHeaderHarness)

    const band = screen.getByRole('banner')

    expect(band).toHaveAttribute('data-slot', 'site-header')
    expect(band).toHaveClass('sticky', 'top-0', 'backdrop-blur')
    expect(slot('site-header-bar')).toHaveClass('bg-card', 'rounded-xl', 'border')
    expect(slot('site-header-bar')).toContainElement(screen.getByRole('button', { name: 'Toggle' }))
  })

  it('caps its content at the content column by default, and takes contentClass instead', () => {
    const { unmount } = render(SiteHeaderHarness)

    expect(slot('site-header-content')).toHaveClass('max-w-content')

    unmount()

    render(SiteHeaderHarness, { contentClass: 'max-w-5xl' })

    expect(slot('site-header-content')).toHaveClass('max-w-5xl')
    expect(slot('site-header-content')).not.toHaveClass('max-w-content')
  })

  it('draws a short vertical separator between groups', () => {
    render(SiteHeaderHarness)

    const separator = slot('site-header-separator')

    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveClass('h-4')
  })
})
