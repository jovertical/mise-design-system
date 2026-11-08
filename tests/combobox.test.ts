import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ComboboxChipsHarness from './fixtures/combobox-chips-harness.svelte'
import ComboboxHarness from './fixtures/combobox-harness.svelte'

// Floating content is visibility: hidden in jsdom, so items are matched by text.
const items = () =>
  [...document.body.querySelectorAll('[data-slot="combobox-item"]')].map((item) =>
    item.textContent?.trim(),
  )

describe('Combobox', () => {
  it('opens a list from typing and narrows it to what matches', async () => {
    render(ComboboxHarness)
    await userEvent.type(screen.getByRole('combobox', { name: 'Category' }), 'pa')
    await waitFor(() => expect(items()).toEqual(['Pastry', 'Packaging']))
    const content = document.body.querySelector('[data-slot="combobox-content"]')
    expect(content).toHaveClass('bg-popover', 'rounded-2xl', 'ring-1')
  })

  it('shows the empty state when nothing matches', async () => {
    render(ComboboxHarness)
    await userEvent.type(screen.getByRole('combobox', { name: 'Category' }), 'zz')
    await waitFor(() => expect(screen.getByText('No categories found.')).toBeInTheDocument())
    expect(items()).toEqual([])
  })

  it('picks an option, binding value and filling the field', async () => {
    render(ComboboxHarness)
    const field = screen.getByRole('combobox', { name: 'Category' })
    await userEvent.type(field, 'cak')
    await waitFor(() => expect(items()).toEqual(['Cakes']))
    const item = document.body.querySelector('[data-slot="combobox-item"]') as HTMLElement
    await userEvent.click(item)
    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('Cakes'))
    expect(field).toHaveValue('Cakes')
  })

  it('shows clear only while there is a value, and clearing empties both', async () => {
    render(ComboboxHarness, { value: 'Bread' })
    const clear = screen.getByRole('button', { name: 'Clear' })
    expect(clear).toHaveAttribute('data-slot', 'combobox-clear')
    await userEvent.click(clear)
    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent(''))
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
  })
})

describe('Combobox chips', () => {
  it('draws a chip per value and removes one from its button', async () => {
    render(ComboboxChipsHarness)
    const chips = document.querySelectorAll('[data-slot="combobox-chip"]')
    expect([...chips].map((chip) => chip.textContent?.trim())).toEqual(['Bread', 'Cakes'])
    await userEvent.click(screen.getByRole('button', { name: 'Remove Bread' }))
    await waitFor(() => expect(screen.getByTestId('value')).toHaveTextContent('Cakes'))
    expect(document.querySelectorAll('[data-slot="combobox-chip"]')).toHaveLength(1)
  })

  it('wraps the chips and their input as one field', () => {
    render(ComboboxChipsHarness)
    const field = document.querySelector('[data-slot="combobox-chips"]') as HTMLElement
    expect(field).toHaveClass('bg-input/50', 'rounded-2xl', 'flex-wrap')
    expect(field).toContainElement(screen.getByRole('combobox', { name: 'Categories' }))
  })
})
