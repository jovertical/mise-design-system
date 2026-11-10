import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import DatePickerHarness from './fixtures/date-picker-harness.svelte'

const trigger = () => document.querySelector('[data-slot="date-picker-trigger"]') as HTMLElement
const panel = () => document.body.querySelector('[data-slot="popover-content"]')

const day = (iso: string) =>
  document.body.querySelector(
    `[data-bits-day][data-value="${iso}"]:not([data-outside-month])`,
  ) as HTMLElement

describe('DatePicker', () => {
  it('shows the chosen date as a long date on a full-width trigger', () => {
    render(DatePickerHarness)

    expect(trigger()).toHaveTextContent('March 14, 2026')
    expect(trigger()).toHaveClass('w-full', 'justify-start', 'font-normal')
  })

  it('closes on a picked day and binds it', async () => {
    render(DatePickerHarness)

    await userEvent.click(trigger())

    await waitFor(() => expect(day('2026-03-18')).not.toBeNull())

    await userEvent.click(day('2026-03-18'))

    expect(screen.getByTestId('value')).toHaveTextContent('2026-03-18')
    expect(trigger()).toHaveTextContent('March 18, 2026')

    await waitFor(() => expect(panel()).toBeNull())
  })

  it('stays open on a range until both ends are picked', async () => {
    render(DatePickerHarness, { mode: 'range' })

    expect(trigger()).toHaveTextContent('March 2, 2026')

    await userEvent.click(trigger())

    await waitFor(() => expect(day('2026-03-05')).not.toBeNull())

    // The range already starts on the 2nd, so the next pick is its end.
    expect(panel()).not.toBeNull()

    await userEvent.click(day('2026-03-05'))

    await waitFor(() =>
      expect(screen.getByTestId('value')).toHaveTextContent('2026-03-02..2026-03-05'),
    )

    expect(trigger()).toHaveTextContent('March 2, 2026 – March 5, 2026')

    await waitFor(() => expect(panel()).toBeNull())
  })

  it('cannot be opened when disabled', async () => {
    render(DatePickerHarness, { disabled: true })

    expect(trigger()).toBeDisabled()

    await userEvent.click(trigger())

    expect(panel()).toBeNull()
  })

  it('greys out days below the floor, which cannot be picked', async () => {
    render(DatePickerHarness, { floor: true })

    await userEvent.click(trigger())

    await waitFor(() => expect(day('2026-03-09')).not.toBeNull())

    expect(day('2026-03-09')).toHaveAttribute('data-disabled')

    await userEvent.click(day('2026-03-09'))

    expect(screen.getByTestId('value')).toHaveTextContent('2026-03-14')
  })
})
