import { CalendarDate } from '@internationalized/date'
import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import CalendarHarness from './fixtures/calendar-harness.svelte'
import RangeCalendarHarness from './fixtures/range-calendar-harness.svelte'

const day = (iso: string) =>
  document.querySelector(
    `[data-bits-day][data-value="${iso}"]:not([data-outside-month])`,
  ) as HTMLElement

describe('Calendar', () => {
  it('draws the month in view, outside days included, under its caption', () => {
    render(CalendarHarness)
    expect(screen.getByText('March 2026')).toHaveClass('text-sm', 'font-medium')
    // March 2026 starts on a Sunday and ends on a Tuesday: the last row runs into April.
    expect(document.querySelector('[data-bits-day][data-value="2026-04-01"]')).toHaveAttribute(
      'data-outside-month',
    )
    expect(document.querySelector('[data-slot="calendar"]')).toHaveClass(
      '[--cell-size:--spacing(8)]',
    )
  })

  it('binds the picked day, and marks it selected', async () => {
    render(CalendarHarness)
    await userEvent.click(day('2026-03-18'))
    expect(screen.getByTestId('value')).toHaveTextContent('2026-03-18')
    expect(day('2026-03-18')).toHaveAttribute('data-selected')
    expect(day('2026-03-18')).toHaveClass('data-[selected]:bg-primary')
  })

  it('disables days by rule and below a floor', async () => {
    render(CalendarHarness, { disableWeekends: true, minValue: new CalendarDate(2026, 3, 10) })
    expect(day('2026-03-14')).toHaveAttribute('data-disabled')
    expect(day('2026-03-09')).toHaveAttribute('data-disabled')
    await userEvent.click(day('2026-03-09'))
    expect(screen.getByTestId('value')).toHaveTextContent('')
  })

  it('moves the grid with the month nav', async () => {
    render(CalendarHarness)
    const [, next] = document.querySelectorAll('nav button')
    await userEvent.click(next as HTMLElement)
    expect(screen.getByText('April 2026')).toBeInTheDocument()
  })

  it('swaps the caption for month and year selects in the dropdown layout', () => {
    render(CalendarHarness, { captionLayout: 'dropdown' })
    const selects = document.querySelectorAll('select')
    expect(selects).toHaveLength(2)
    expect(selects[0]).toHaveValue('3')
    expect(selects[1]).toHaveValue('2026')
  })
})

describe('RangeCalendar', () => {
  it('binds a start and an end, and marks the days between', async () => {
    render(RangeCalendarHarness)
    await userEvent.click(day('2026-03-10'))
    await userEvent.click(day('2026-03-13'))
    expect(screen.getByTestId('value')).toHaveTextContent('2026-03-10..2026-03-13')
    expect(day('2026-03-10')).toHaveAttribute('data-range-start')
    expect(day('2026-03-11')).toHaveAttribute('data-range-middle')
    expect(day('2026-03-13')).toHaveAttribute('data-range-end')
    expect(day('2026-03-11')).toHaveClass('data-[range-middle]:bg-muted')
  })
})
