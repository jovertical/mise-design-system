import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { PageLayout } from '../src/lib/index.js'
import LocationHeader from './fixtures/location-header.svelte'
import PageHeaderBackLinkHarness from './fixtures/page-header-back-link-harness.svelte'
import { text } from './snippet.js'

describe('PageHeader', () => {
  it('sets the title as the page h1, with its description and actions', () => {
    render(LocationHeader, { title: 'Riverside' })

    expect(screen.getByRole('heading', { level: 1, name: 'Riverside' })).toBeInTheDocument()
    expect(screen.getByText('Opened 4 June 2026')).toHaveClass('line-clamp-2')
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
  })

  it('renders no h1 without a title, leaving the heading to the body', () => {
    render(LocationHeader, { withTrail: true, withAccessory: true })

    expect(screen.queryByRole('heading')).toBeNull()
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('shows the back link in place of the trail when both are given', () => {
    render(LocationHeader, { title: 'Edit location', withTrail: true, withBackLink: true })

    expect(screen.getByRole('link', { name: 'Back to locations' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).toBeNull()
  })

  it('truncates a title on request, keeping the whole of it as a tooltip', () => {
    const subject = 'The register at the North location stops sending orders after a few hours'

    render(LocationHeader, { title: subject, truncateTitle: true, withAccessory: true })

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toHaveClass('truncate', 'max-w-3xl')
    expect(heading).toHaveAttribute('title', subject)
  })

  it('sets an eyebrow small and uppercase above the title', () => {
    render(LocationHeader, { title: 'RT-2026-0176', eyebrow: 'Route detail' })

    expect(screen.getByText('Route detail')).toHaveClass('uppercase', 'text-xs')
  })
})

describe('PageLayout', () => {
  it('is the padded page column', () => {
    const { container } = render(PageLayout, { children: text('Body') })

    expect(container.querySelector('[data-slot="page-layout"]')).toHaveClass(
      'px-4',
      'lg:px-6',
      'gap-4',
    )
  })
})

describe('PageHeaderBackLink', () => {
  it('draws a back link with its chevron, where the breadcrumb would be', () => {
    render(PageHeaderBackLinkHarness)

    const link = screen.getByRole('link', { name: 'Locations' })

    expect(link).toHaveAttribute('href', '/locations')
    expect(link).toHaveAttribute('data-slot', 'page-header-back-link')
    expect(link.querySelector('svg')).not.toBeNull()
  })
})
