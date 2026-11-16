import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import PickerOpenHarness from './fixtures/picker-open-harness.svelte'

const host = () => screen.getByTestId('host')

describe('DatePicker and MonthPicker, opened and placed by the caller', () => {
  it('shows the calendar from a bound open, inside the page when the portal is off', () => {
    render(PickerOpenHarness, { picker: 'date' })

    expect(host().querySelector('[data-slot="popover-content"]')).not.toBeNull()

    expect(host().querySelector('[data-bits-day][data-value="2026-03-18"]')).not.toBeNull()
  })

  it('reports a pick through the bound open', async () => {
    render(PickerOpenHarness, { picker: 'date' })

    const day = host().querySelector(
      '[data-bits-day][data-value="2026-03-18"]:not([data-outside-month])',
    ) as HTMLElement

    await userEvent.click(day)

    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('false'))
  })

  it('shows the month grid from a bound open, inside the page when the portal is off', () => {
    render(PickerOpenHarness, { picker: 'month' })

    expect(host().querySelector('[data-slot="month-picker-grid"]')).not.toBeNull()
  })
})
