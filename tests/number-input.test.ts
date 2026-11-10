import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import NumberInputHarness from './fixtures/number-input-harness.svelte'

const field = () => screen.getByRole('spinbutton', { name: 'Amount' }) as HTMLInputElement
const bound = () => screen.getByTestId('value').textContent
const blur = () => userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }))

describe('NumberInput', () => {
  it('is a text field, never type="number", with a keypad hint per format', () => {
    render(NumberInputHarness, { format: 'integer' })

    expect(field()).toHaveAttribute('type', 'text')
    expect(field()).toHaveAttribute('inputmode', 'numeric')
  })

  it('holds a draft through "0." and "-" and reports each number as typed', async () => {
    render(NumberInputHarness, { min: -10 })

    await userEvent.type(field(), '-')

    expect(field()).toHaveValue('-')
    expect(bound()).toBe('null')

    await userEvent.type(field(), '0.')

    expect(field()).toHaveValue('-0.')

    await userEvent.type(field(), '5')

    expect(bound()).toBe('-0.5')
  })

  it('drops keystrokes that cannot become a number, and a pasted comma', async () => {
    render(NumberInputHarness)

    await userEvent.click(field())

    await userEvent.paste('1,500')

    expect(bound()).toBe('1500')

    await userEvent.type(field(), 'e-')

    expect(field()).toHaveValue('1500')
  })

  it('clamps to min and max as typed and on blur', async () => {
    render(NumberInputHarness, { min: 1, max: 20 })

    await userEvent.type(field(), '35')

    expect(bound()).toBe('20')

    await blur()

    expect(field()).toHaveValue('20')
  })

  it('commits null for an emptied field, or min when not clearable', async () => {
    const { unmount } = render(NumberInputHarness, { value: 4 })

    await userEvent.clear(field())

    await blur()

    expect(bound()).toBe('null')

    unmount()

    render(NumberInputHarness, { value: 4, min: 1, clearable: false })

    await userEvent.clear(field())

    await blur()

    expect(bound()).toBe('1')
    expect(field()).toHaveValue('1')
  })

  it('steps with the arrow keys, ten times as far with Shift, rounding the sum', async () => {
    render(NumberInputHarness, { value: 0.1, step: 0.2 })

    await userEvent.click(field())

    await userEvent.keyboard('{ArrowUp}')

    expect(bound()).toBe('0.3')

    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}')

    expect(bound()).toBe('2.3')

    await userEvent.keyboard('{ArrowDown}')

    expect(bound()).toBe('2.1')
  })

  it('caps the typed decimal places at precision, and integer at none', async () => {
    const { unmount } = render(NumberInputHarness, { precision: 2 })

    await userEvent.type(field(), '1.2345')

    expect(field()).toHaveValue('1.23')

    unmount()

    render(NumberInputHarness, { format: 'integer' })

    await userEvent.type(field(), '7.5')

    expect(field()).toHaveValue('75')
  })

  it('speaks cents as currency: shows two places and takes cents back', async () => {
    render(NumberInputHarness, { format: 'currency', value: 1999, prefix: '$' })

    expect(field()).toHaveValue('19.99')
    expect(screen.getByText('$')).toBeInTheDocument()

    await userEvent.clear(field())

    await userEvent.type(field(), '1.')

    expect(field()).toHaveValue('1.')
    expect(bound()).toBe('100')

    await userEvent.type(field(), '256')

    expect(field()).toHaveValue('1.25')
    expect(bound()).toBe('125')

    await blur()

    expect(field()).toHaveValue('1.25')
  })

  it('draws − and + that step and disable at each end of the range', async () => {
    render(NumberInputHarness, { format: 'integer', controls: true, value: 1, min: 0, max: 2 })

    const decrease = screen.getByRole('button', { name: 'Decrease Amount' })
    const increase = screen.getByRole('button', { name: 'Increase Amount' })

    await userEvent.click(increase)

    expect(bound()).toBe('2')
    expect(increase).toBeDisabled()

    await userEvent.click(decrease)

    await userEvent.click(decrease)

    expect(bound()).toBe('0')
    expect(decrease).toBeDisabled()
    expect(field()).toHaveClass('text-center')
  })

  it('caps its width with controls, so a Field stretching every child cannot widen it', () => {
    const { container } = render(NumberInputHarness, { controls: true })
    const root = container.querySelector('[data-slot="number-input"]')

    expect(root).toHaveClass('max-w-32')
    expect(root).not.toHaveClass('w-32')
  })

  it('lets a caller lift the cap', () => {
    const { container } = render(NumberInputHarness, { controls: true, class: 'max-w-48' })
    const root = container.querySelector('[data-slot="number-input"]')

    expect(root).toHaveClass('max-w-48')
    expect(root).not.toHaveClass('max-w-32')
  })

  it('keeps − disabled on an empty field, and + starts it at the floor', async () => {
    render(NumberInputHarness, { format: 'integer', controls: true, min: 2 })

    expect(screen.getByRole('button', { name: 'Decrease Amount' })).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'Increase Amount' }))

    expect(bound()).toBe('2')
  })
})
