import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import SummaryCardHarness from './fixtures/summary-card-harness.svelte'

describe('SummaryCard', () => {
  it('heads its card with an icon title and fills its row', () => {
    render(SummaryCardHarness)

    const card = document.querySelector('[data-slot="card"]') as HTMLElement

    expect(card).toHaveClass('h-full', 'gap-4')

    expect(card.querySelector('[data-slot="card-title"]')).toContainElement(
      screen.getByTestId('icon'),
    )

    expect(screen.getByText('Wool scarf').parentElement).toHaveAttribute('data-stack', 'sm')
  })

  it('puts the way back in the card action, and nothing when read-only', () => {
    const { unmount } = render(SummaryCardHarness)

    expect(
      screen.getByRole('button', { name: 'Edit' }).closest('[data-slot="card-action"]'),
    ).not.toBeNull()

    unmount()

    render(SummaryCardHarness, { withAction: false })

    expect(document.querySelector('[data-slot="card-action"]')).toBeNull()
  })
})
