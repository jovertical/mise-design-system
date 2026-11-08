import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import AsideCardHarness from './fixtures/aside-card-harness.svelte'

const tip = 'The company name appears on every receipt.'

describe('AsideCard', () => {
  it('starts open and folds from its header button', async () => {
    render(AsideCardHarness)
    expect(screen.getByText(tip)).toBeVisible()
    const toggle = screen.getByRole('button', { name: 'Collapse Tips' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(toggle)
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Expand Tips' })).toHaveAttribute(
        'aria-expanded',
        'false',
      ),
    )
    await waitFor(() => expect(screen.queryByText(tip)).not.toBeVisible())
  })

  it('starts collapsed when asked', () => {
    render(AsideCardHarness, { open: false })
    expect(screen.getByRole('button', { name: 'Expand Tips' })).toBeInTheDocument()
  })

  it('draws the icon muted beside the title', () => {
    render(AsideCardHarness)
    expect(screen.getByTestId('icon').parentElement).toHaveClass('text-muted-foreground')
    expect(screen.getByText('Tips')).toHaveClass('text-base')
  })
})
