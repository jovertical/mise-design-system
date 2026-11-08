import { render, screen, waitFor } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import HoverCardHarness from './fixtures/hover-card-harness.svelte'

const panel = () => document.body.querySelector('[data-slot="hover-card-content"]') as HTMLElement

describe('HoverCard', () => {
  it('stays closed until asked, behind its trigger', () => {
    render(HoverCardHarness)
    expect(panel()).toBeNull()
    expect(screen.getByRole('button', { name: 'Dana Reyes' })).toHaveAttribute(
      'data-slot',
      'hover-card-trigger',
    )
  })

  it('renders its content on the popover surface when open', async () => {
    render(HoverCardHarness, { open: true })
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(panel()).toHaveTextContent('Shift lead, North depot')
    expect(panel()).toHaveClass('bg-popover', 'rounded-2xl', 'w-64', 'p-4', 'ring-1')
  })

  // jsdom cannot drive bits-ui's pointer-intent logic, so hover is checked in
  // Storybook; keyboard focus is the path a test can exercise.
  it('opens when the trigger takes keyboard focus', async () => {
    render(HoverCardHarness)
    screen.getByRole('button', { name: 'Dana Reyes' }).focus()
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('open'))
  })
})
