import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import LocationSelect from './fixtures/location-select.svelte'

const trigger = () => screen.getByRole('combobox', { name: 'Location' })

// Floating UI hides the list with `visibility: hidden` until it can measure
// the trigger, and jsdom never lays anything out. The options are in the DOM
// and clickable, but hidden content has no accessible name, so an option is
// found by its text.
async function option(text: string): Promise<HTMLElement> {
  const options = await screen.findAllByRole('option', { hidden: true })
  const match = options.find((candidate) => candidate.textContent?.trim() === text)
  if (!match) throw new Error(`no option reading "${text}"`)
  return match
}

describe('Select', () => {
  it('shows the selected label in a full-width trigger', () => {
    render(LocationSelect)
    expect(trigger()).toHaveAttribute('data-slot', 'select-trigger')
    expect(trigger()).toHaveAttribute('data-size', 'md')
    expect(trigger()).toHaveClass('w-full')
    expect(trigger()).toHaveTextContent('Riverside')
  })

  it('opens a listbox, takes a choice and binds the value back', async () => {
    render(LocationSelect)
    await userEvent.click(trigger())
    await userEvent.click(await option('Harbour'))
    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('harbour'))
    expect(trigger()).toHaveTextContent('Harbour')
  })

  it('marks the selected option and draws its check', async () => {
    render(LocationSelect)
    await userEvent.click(trigger())
    const riverside = await option('Riverside')
    expect(riverside).toHaveAttribute('aria-selected', 'true')
    expect(riverside.querySelector('[data-slot="select-item-indicator"] svg')).not.toBeNull()
  })

  it('does not take a disabled option', async () => {
    render(LocationSelect)
    await userEvent.click(trigger())
    const north = await option('North yard')
    expect(north).toHaveAttribute('data-disabled')
    await userEvent.click(north)
    expect(screen.getByTestId('value')).toHaveTextContent('riverside')
  })
})
