import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Input } from '../src/lib/index.js'
import LabelledInput from './fixtures/labelled-input.svelte'

describe('Input and Label', () => {
  it('associates the label with the input', () => {
    render(LabelledInput)

    const input = screen.getByLabelText('Location name')

    expect(input).toHaveAttribute('data-slot', 'input')
    expect(screen.getByText('Location name')).toHaveAttribute('data-slot', 'label')
  })

  it('binds the value both ways', async () => {
    render(LabelledInput, { value: 'North' })

    const input = screen.getByLabelText('Location name')

    expect(input).toHaveValue('North')

    await userEvent.clear(input)

    await userEvent.type(input, 'Harbour')

    expect(screen.getByTestId('echo')).toHaveTextContent('Harbour')
  })

  it('draws the React classes and merges a caller class', () => {
    render(Input, { class: 'max-w-xs', placeholder: 'Search orders' })

    const input = screen.getByPlaceholderText('Search orders')

    expect(input).toHaveClass('rounded-2xl', 'bg-input/50', 'h-9', 'max-w-xs')
  })

  it('passes aria-invalid through for the invalid treatment', () => {
    render(Input, { 'aria-invalid': true, placeholder: 'Quantity' })

    expect(screen.getByPlaceholderText('Quantity')).toHaveAttribute('aria-invalid', 'true')
  })

  it.each([
    ['sm', 'h-8'],
    ['md', 'h-9'],
    ['lg', 'h-10'],
  ] as const)('draws size %s at %s', (size, height) => {
    render(Input, { size, placeholder: 'Quantity' })

    const input = screen.getByPlaceholderText('Quantity')

    expect(input).toHaveAttribute('data-size', size)
    expect(input).toHaveClass(height)
  })
})
