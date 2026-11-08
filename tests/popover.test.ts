import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import FilterPopover from './fixtures/filter-popover.svelte'

const panel = () => document.body.querySelector('[data-slot="popover-content"]') as HTMLElement

describe('Popover', () => {
  it('opens from its trigger and binds open', async () => {
    render(FilterPopover)
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }))
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(screen.getByTestId('open')).toHaveTextContent('open')
    expect(panel()).toHaveClass('bg-popover', 'rounded-3xl', 'w-72', 'p-4')
  })

  it('takes the trigger width and drops the padding when asked', async () => {
    render(FilterPopover, { open: true, matchTriggerWidth: true })
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(panel()).toHaveClass('w-[var(--bits-popover-anchor-width)]', 'p-0')
    expect(panel()).not.toHaveClass('w-72')
  })

  it('closes on Escape', async () => {
    render(FilterPopover, { open: true })
    await waitFor(() => expect(panel()).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })
})
