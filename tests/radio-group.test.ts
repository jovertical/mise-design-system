import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import DiscountRadio from './fixtures/discount-radio.svelte'

const indicatorIcons = (container: HTMLElement) =>
  container.querySelectorAll('[data-slot="radio-group-indicator"] svg')

describe('RadioGroup', () => {
  it('renders a radiogroup with one radio checked and its indicator drawn', () => {
    const { container } = render(DiscountRadio)

    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-slot', 'radio-group')

    expect(screen.getByRole('radio', { name: 'Percentage off' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    expect(indicatorIcons(container)).toHaveLength(1)
  })

  it('selects on click and binds the value back', async () => {
    render(DiscountRadio)

    await userEvent.click(screen.getByRole('radio', { name: 'Fixed amount off' }))

    expect(screen.getByRole('radio', { name: 'Fixed amount off' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    expect(screen.getByTestId('value')).toHaveTextContent('fixed')
  })

  it('moves the selection with the arrow keys', async () => {
    render(DiscountRadio)

    screen.getByRole('radio', { name: 'Percentage off' }).focus()

    await userEvent.keyboard('{ArrowDown}')

    expect(screen.getByTestId('value')).toHaveTextContent('fixed')
  })

  it('ignores a disabled item', async () => {
    render(DiscountRadio)

    await userEvent.click(screen.getByRole('radio', { name: 'Buy one, get one' }))

    expect(screen.getByTestId('value')).toHaveTextContent('percentage')
  })
})
