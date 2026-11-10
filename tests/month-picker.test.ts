import type { CalendarDate } from '@internationalized/date'
import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import MonthPickerHarness from './fixtures/month-picker-harness.svelte'

const trigger = () => document.querySelector('[data-slot="month-picker-trigger"]') as HTMLElement
const bound = () => screen.getByTestId('value').textContent

async function open() {
  await userEvent.click(trigger())

  return waitFor(() => {
    const grid = document.body.querySelector('[data-slot="month-picker-grid"]')

    expect(grid).not.toBeNull()

    return grid as HTMLElement
  })
}

const month = (name: string) =>
  [...document.body.querySelectorAll('[data-slot="month-picker-month"]')].find(
    (candidate) => candidate.textContent?.trim() === name,
  ) as HTMLButtonElement

// Floating content is visibility: hidden in jsdom, so its buttons are found by their label.
const yearButton = (label: string) =>
  document.body.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement

const heading = () => document.body.querySelector('[data-slot="month-picker-year"]')?.textContent

describe('MonthPicker', () => {
  it('labels the trigger with the month and year', () => {
    render(MonthPickerHarness)

    expect(trigger()).toHaveTextContent('March 2026')
  })

  it('labels the trigger with formatLabel when given', () => {
    render(MonthPickerHarness, {
      formatLabel: (value: CalendarDate) => `${value.month}/${value.year}`,
    })

    expect(trigger()).toHaveTextContent('3/2026')
  })

  it('shows a placeholder when empty', () => {
    render(MonthPickerHarness, { empty: true })

    expect(trigger()).toHaveTextContent('Pick a month')
    expect(trigger()).toHaveAttribute('data-placeholder', '')
  })

  it('opens on the value year, and a picked month binds its first day and closes', async () => {
    render(MonthPickerHarness)

    await open()

    expect(heading()).toBe('2026')
    expect(month('Mar')).toHaveAttribute('data-selected', '')

    await userEvent.click(month('Jul'))

    expect(bound()).toBe('2026-07-01')

    await waitFor(() =>
      expect(document.body.querySelector('[data-slot="month-picker-grid"]')).toBeNull(),
    )
  })

  it('moves between years', async () => {
    render(MonthPickerHarness)

    await open()

    await userEvent.click(yearButton('Previous year'))

    expect(heading()).toBe('2025')

    await userEvent.click(month('Dec'))

    expect(bound()).toBe('2025-12-01')
  })

  it('disables months outside its bounds and the year buttons at the ends', async () => {
    render(MonthPickerHarness, { bounded: true })

    await open()

    expect(month('Apr')).not.toBeDisabled()
    expect(month('May')).toBeDisabled()
    expect(yearButton('Next year')).toBeDisabled()

    await userEvent.click(yearButton('Previous year'))

    expect(month('Oct')).toBeDisabled()
    expect(month('Nov')).not.toBeDisabled()
    expect(yearButton('Previous year')).toBeDisabled()
  })

  it('moves across the grid with the arrow keys and picks with Enter', async () => {
    render(MonthPickerHarness)

    await open()

    month('Mar').focus()

    await userEvent.keyboard('{ArrowRight}')

    expect(month('Apr')).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')

    expect(month('Jul')).toHaveFocus()

    await userEvent.keyboard('{Enter}')

    expect(bound()).toBe('2026-07-01')
  })

  it('puts its id and invalid state on the trigger, where a label reaches them', async () => {
    render(MonthPickerHarness, { invalid: true })

    expect(trigger()).toHaveAttribute('id', 'report-month')
    expect(trigger()).toHaveAttribute('aria-invalid', 'true')

    await userEvent.click(screen.getByText('Month'))

    expect(trigger()).toHaveFocus()
  })
})
