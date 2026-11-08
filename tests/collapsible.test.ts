import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import CollapsibleHarness from './fixtures/collapsible-harness.svelte'

describe('Collapsible', () => {
  it('toggles its content from the trigger, and binds open', async () => {
    render(CollapsibleHarness)
    const trigger = screen.getByRole('button', { name: 'Show details' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('North depot holds 398 units.')).not.toBeVisible()

    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
    const content = screen.getByText('North depot holds 398 units.')
    expect(content).toBeVisible()
    expect(content).toHaveAttribute('data-slot', 'collapsible-content')
    expect(screen.getByTestId('open')).toHaveTextContent('open')

    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
  })

  it('starts open when asked', () => {
    render(CollapsibleHarness, { open: true })
    expect(screen.getByText('North depot holds 398 units.')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="collapsible"]')).toHaveAttribute(
      'data-state',
      'open',
    )
  })
})
