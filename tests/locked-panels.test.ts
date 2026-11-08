import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import LockedPanelsHarness from './fixtures/locked-panels-harness.svelte'

const sample = (slot: string) => document.querySelector(`[data-slot="${slot}"]`) as HTMLElement

describe('LockedOverlay', () => {
  it('keeps the sample inert, blurred and hidden from assistive technology', () => {
    render(LockedPanelsHarness)
    const body = sample('locked-overlay-sample')
    expect(body).toHaveAttribute('inert')
    expect(body).toHaveAttribute('aria-hidden', 'true')
    expect(body).toHaveClass('blur-sm', 'pointer-events-none')
    expect(screen.queryByRole('link', { name: /Top product/ })).toBeNull()
  })

  it('pitches with the title, the message and the action', () => {
    render(LockedPanelsHarness)
    expect(screen.getByText('Sales by location')).toBeInTheDocument()
    expect(screen.getByText('See which location sells the most.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask for access' })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="locked-overlay"]')).toHaveClass('grid', 'h-full')
  })
})

describe('FeaturePreview', () => {
  it('blurs an inert sample under a pitch with its benefits and actions', () => {
    render(LockedPanelsHarness, { which: 'preview' })
    expect(sample('feature-preview-sample')).toHaveAttribute('inert')
    expect(screen.getByText('Purchase orders')).toHaveAttribute('data-slot', 'card-title')
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Raise orders from low stock.',
      'Receive deliveries in part.',
    ])
    expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument()
  })

  it('stands the primary action alone without a secondary', () => {
    render(LockedPanelsHarness, { which: 'preview', secondary: false })
    expect(screen.getByRole('button', { name: 'Turn on purchase orders' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Learn more' })).toBeNull()
  })
})
