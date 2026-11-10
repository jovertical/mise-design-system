import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import QuantityInputHarness from './fixtures/quantity-input-harness.svelte'

const root = () => document.querySelector('[data-slot="quantity-input"]') as HTMLElement
const amount = () => screen.getByRole('spinbutton')
const trigger = () => document.querySelector('[data-slot="select-trigger"]') as HTMLElement
const state = () => screen.getByTestId('state').textContent

// Floating content is visibility: hidden in jsdom, so options are matched by text.
const option = (label: string) =>
  [...document.body.querySelectorAll('[data-slot="select-item"]')].find(
    (item) => item.textContent?.trim() === label,
  ) as HTMLElement

describe('QuantityInput', () => {
  it('leads with the unit by default, showing its full label', () => {
    render(QuantityInputHarness)

    expect(root()).toHaveAttribute('data-layout', 'unit-first')
    expect(root().firstElementChild).toContainElement(trigger())
    expect(trigger()).toHaveTextContent('Gram (g)')
    expect(amount()).toHaveValue('1250')
  })

  it('seats the leading unit trigger flush with the group edge, so its fill is not an inset pill', () => {
    render(QuantityInputHarness)

    const addon = trigger().closest('[data-slot="input-group-addon"]')

    expect(addon).toHaveClass('pl-0')
    expect(addon).not.toHaveClass('pl-3')
    expect(trigger()).toHaveClass('h-full', 'w-full', 'rounded-l-2xl')
  })

  it('leads with the amount when asked, the unit trailing in its short form', () => {
    render(QuantityInputHarness, { layout: 'quantity-first', unit: 'ml' })

    expect(root().firstElementChild).toBe(amount())
    expect(trigger()).toHaveTextContent('ml')
    expect(trigger()).not.toHaveTextContent('Milliliter')
    expect(trigger()).toHaveClass('w-24', 'border-l')
  })

  it('binds a typed quantity and reports its blur', async () => {
    render(QuantityInputHarness)

    await userEvent.clear(amount())

    await userEvent.type(amount(), '30.5')

    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }))

    expect(state()).toBe('g:30.5:1')
  })

  it('binds a chosen unit', async () => {
    render(QuantityInputHarness)

    await userEvent.click(trigger())

    await waitFor(() => expect(option('Milliliter (ml)')).toBeDefined())

    await userEvent.click(option('Milliliter (ml)'))

    await waitFor(() => expect(state()).toBe('ml:1250:0'))
  })

  it('lists units under a heading per group, with a hint beside one', async () => {
    render(QuantityInputHarness, { grouped: true })

    await userEvent.click(trigger())

    await waitFor(() =>
      expect(document.body.querySelector('[data-slot="select-content"]')).not.toBeNull(),
    )

    const headings = [...document.body.querySelectorAll('[data-slot="select-label"]')]

    expect(headings.map((heading) => heading.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Mass',
      'Volume needs density',
    ])

    expect(document.body.querySelectorAll('[data-slot="select-separator"]')).toHaveLength(1)
  })

  it('hands the menu footer a closeMenu', async () => {
    render(QuantityInputHarness, { footer: true })

    await userEvent.click(trigger())

    const footer = await waitFor(() => {
      const element = document.body.querySelector('[data-slot="quantity-input-menu-footer"]')

      expect(element).not.toBeNull()

      return element as HTMLElement
    })

    await userEvent.click(footer.querySelector('button') as HTMLElement)

    await waitFor(() => expect(trigger()).toHaveAttribute('data-state', 'closed'))
  })
})
