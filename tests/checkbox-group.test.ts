import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import CheckboxGroupHarness from './fixtures/checkbox-group-harness.svelte'

const group = () => document.querySelector('[data-slot="checkbox-group"]') as HTMLElement

describe('CheckboxGroup', () => {
  it('names the set by its legend and each checkbox by its label', () => {
    render(CheckboxGroupHarness)

    expect(screen.getByRole('group', { name: 'Locations' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'North depot' })).toBeInTheDocument()
    expect(screen.getByText('Where this shift runs.')).toBeInTheDocument()
    expect(screen.getByText('Closed on Sundays')).toBeInTheDocument()
  })

  it('adds a ticked value and removes an unticked one, in the order of the options', async () => {
    render(CheckboxGroupHarness)

    await userEvent.click(screen.getByRole('checkbox', { name: 'South depot' }))

    await userEvent.click(screen.getByRole('checkbox', { name: 'North depot' }))

    expect(screen.getByTestId('value')).toHaveTextContent('north,south')

    await userEvent.click(screen.getByRole('checkbox', { name: 'North depot' }))

    expect(screen.getByTestId('value')).toHaveTextContent(/^south$/)
  })

  it('ticks from a click on the label', async () => {
    render(CheckboxGroupHarness)

    await userEvent.click(screen.getByText('North depot'))

    expect(screen.getByTestId('value')).toHaveTextContent('north')
  })

  it('does not tick a disabled option', async () => {
    render(CheckboxGroupHarness)

    const harbour = screen.getByRole('checkbox', { name: 'Harbour store' })

    await userEvent.click(harbour)

    expect(harbour).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByTestId('value').textContent).toBe('')
  })

  it('starts from the bound value', () => {
    render(CheckboxGroupHarness, { value: ['south'] })

    expect(screen.getByRole('checkbox', { name: 'South depot' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    expect(screen.getByRole('checkbox', { name: 'North depot' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('submits each ticked value under name[]', () => {
    const { container } = render(CheckboxGroupHarness, { value: ['north'], name: 'locations' })

    const submitted = [
      ...container.querySelectorAll('input[name="locations[]"]:checked'),
    ] as HTMLInputElement[]

    expect(submitted.map((input) => input.value)).toEqual(['north'])
  })

  it('shows its errors and marks the set invalid', () => {
    render(CheckboxGroupHarness, { errors: [{ message: 'Pick at least one location.' }] })

    expect(screen.getByRole('alert')).toHaveTextContent('Pick at least one location.')
    expect(group()).toHaveAttribute('data-invalid', 'true')
  })

  it('says so when there is nothing to choose', () => {
    render(CheckboxGroupHarness, { options: [] })

    expect(screen.getByText('Nothing to choose from.')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).toBeNull()
  })
})
