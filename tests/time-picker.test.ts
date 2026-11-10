import { Time } from '@internationalized/date'
import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import TimePickerHarness from './fixtures/time-picker-harness.svelte'

const bound = () => screen.getByTestId('value').textContent

// Floating content is visibility: hidden in jsdom, so options are matched by text.
async function pick(trigger: string, option: string) {
  await userEvent.click(screen.getByRole('combobox', { name: trigger }))

  const item = await waitFor(() => {
    const found = [...document.body.querySelectorAll('[data-slot="select-item"]')].find(
      (candidate) => candidate.textContent?.trim() === option,
    )

    expect(found).toBeDefined()

    return found as HTMLElement
  })

  await userEvent.click(item)
}

describe('TimePicker', () => {
  it('shows a time as hour, minute and period', () => {
    render(TimePickerHarness, { value: new Time(17, 30) })

    expect(screen.getByRole('combobox', { name: 'Hour' })).toHaveTextContent('5')
    expect(screen.getByRole('combobox', { name: 'Minute' })).toHaveTextContent('30')
    expect(screen.getByRole('combobox', { name: 'AM or PM' })).toHaveTextContent('PM')
  })

  it('fills a partial pick from 12:00 AM', async () => {
    render(TimePickerHarness)

    await pick('Minute', '45')

    expect(bound()).toBe('00:45:00')
  })

  it('binds each part over the current value', async () => {
    render(TimePickerHarness, { value: new Time(17, 30) })

    await pick('Hour', '9')

    expect(bound()).toBe('21:30:00')

    await pick('AM or PM', 'AM')

    expect(bound()).toBe('09:30:00')
  })

  it('maps 12 AM to midnight and 12 PM to noon', async () => {
    render(TimePickerHarness, { value: new Time(9, 0) })

    await pick('Hour', '12')

    expect(bound()).toBe('00:00:00')

    await pick('AM or PM', 'PM')

    expect(bound()).toBe('12:00:00')
  })

  it('disables all three', () => {
    render(TimePickerHarness, { disabled: true })

    for (const name of ['Hour', 'Minute', 'AM or PM']) {
      expect(screen.getByRole('combobox', { name })).toBeDisabled()
    }
  })

  it('puts its id and invalid state on the hour select, where a label can reach them', async () => {
    render(TimePickerHarness, { invalid: true })

    const hour = screen.getByRole('combobox', { name: 'Hour' })

    expect(hour).toHaveAttribute('id', 'rollover')
    expect(hour).toHaveAttribute('aria-invalid', 'true')
    expect(document.querySelector('[data-slot="time-picker"]')).not.toHaveAttribute('id')

    await userEvent.click(screen.getByText('Rolls over at'))

    expect(hour).toHaveFocus()
  })

  it('counts 00 to 23 with no period on a 24-hour clock', async () => {
    render(TimePickerHarness, { hourCycle: 24, value: new Time(17, 30) })

    expect(screen.getByRole('combobox', { name: 'Hour' })).toHaveTextContent('17')
    expect(screen.queryByRole('combobox', { name: 'AM or PM' })).toBeNull()

    await pick('Hour', '00')

    expect(bound()).toBe('00:30:00')
  })

  it('lists minutes at its step, keeping a value that falls between', async () => {
    render(TimePickerHarness, { minuteStep: 15, value: new Time(9, 7) })

    await userEvent.click(screen.getByRole('combobox', { name: 'Minute' }))

    const minutes = await waitFor(() => {
      const listed = [...document.body.querySelectorAll('[data-slot="select-item"]')].map((item) =>
        item.textContent?.trim(),
      )

      expect(listed.length).toBeGreaterThan(0)

      return listed
    })

    expect(minutes).toEqual(['00', '07', '15', '30', '45'])
  })
})
