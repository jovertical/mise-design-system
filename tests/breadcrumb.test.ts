import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import ItemTrail from './fixtures/item-trail.svelte'

describe('Breadcrumb', () => {
  it('is a labelled navigation landmark holding a list', () => {
    render(ItemTrail)
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toContainElement(screen.getByRole('list'))
  })

  it('marks the leaf as the current page, not as a link', () => {
    render(ItemTrail)
    const leaf = screen.getByText('Cold brew concentrate')
    expect(leaf).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Items'])
  })

  it('hides the separators from assistive tech, with / by default', () => {
    const { container } = render(ItemTrail)
    const separators = [...container.querySelectorAll('[data-slot="breadcrumb-separator"]')]
    expect(separators.map((separator) => separator.textContent?.trim())).toEqual(['/', '›'])
    for (const separator of separators) expect(separator).toHaveAttribute('aria-hidden', 'true')
  })

  it('names the collapsed crumbs for a screen reader', () => {
    render(ItemTrail)
    expect(screen.getByText('More')).toHaveClass('sr-only')
  })

  it('hands its props to a router link through child', () => {
    render(ItemTrail, { routerLink: true })
    const link = screen.getByRole('link', { name: 'Items' })
    expect(link).toHaveAttribute('data-router', 'true')
    expect(link).toHaveAttribute('href', '/items')
    expect(link).toHaveAttribute('data-slot', 'breadcrumb-link')
  })
})
