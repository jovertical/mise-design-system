import { render, screen, waitFor } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import TooltipHarness from './fixtures/tooltip-harness.svelte'

describe('Tooltip', () => {
  it('renders its content on the popover surface when open', async () => {
    render(TooltipHarness, { open: true })
    const content = await screen.findByText('Regenerate the pairing code')
    const panel = content.closest('[data-slot="tooltip-content"]') as HTMLElement
    expect(panel).toHaveClass('bg-popover', 'rounded-xl')
    expect(panel.querySelector('[data-slot="tooltip-arrow"]')).not.toBeNull()
  })

  it('stays closed until asked', () => {
    render(TooltipHarness)
    expect(screen.queryByText('Regenerate the pairing code')).toBeNull()
    expect(screen.getByRole('button', { name: 'Regenerate' })).toHaveAttribute(
      'data-slot',
      'tooltip-trigger',
    )
  })

  // jsdom cannot drive bits-ui's pointer-intent logic, so hover is checked in
  // Storybook; keyboard focus is the path a test can exercise.
  it('opens when the trigger takes keyboard focus', async () => {
    render(TooltipHarness)
    screen.getByRole('button', { name: 'Regenerate' }).focus()
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('open'))
  })
})
