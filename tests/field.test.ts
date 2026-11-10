import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import LocationField from './fixtures/location-field.svelte'

describe('Field', () => {
  it('names the control from its label, with a spoken "(required)"', () => {
    render(LocationField)

    expect(screen.getByRole('textbox')).toHaveAccessibleName('Location name (required)')
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('(required)')).toHaveClass('sr-only')
  })

  it('is a vertical group by default, and takes an orientation', () => {
    const { unmount } = render(LocationField)

    expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'vertical')

    unmount()

    render(LocationField, { orientation: 'horizontal' })

    expect(screen.getByRole('group')).toHaveClass('flex-row')
  })

  it('renders no error until there is one', () => {
    render(LocationField)

    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('shows one error as text and several as a list, without repeats', () => {
    const { unmount } = render(LocationField, {
      errors: [{ message: 'Required' }, { message: 'Required' }],
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Required')
    expect(screen.queryByRole('list')).toBeNull()

    unmount()

    render(LocationField, { errors: [{ message: 'Too short' }, { message: 'Taken' }] })

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Too short',
      'Taken',
    ])
  })
})
