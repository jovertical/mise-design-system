import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Textarea } from '../src/lib/index.js'

describe('Textarea', () => {
  it('shows no counter without a maxlength', () => {
    const { container } = render(Textarea, { placeholder: 'Notes', 'aria-label': 'Notes' })

    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'textarea')
    expect(container.querySelector('[aria-live]')).toBeNull()
  })

  it('counts towards maxlength as the operator types', async () => {
    render(Textarea, { maxlength: 120, value: 'Thaw', 'aria-label': 'Notes' })

    expect(screen.getByText('4 / 120')).toBeInTheDocument()

    await userEvent.type(screen.getByRole('textbox'), ' first')

    expect(screen.getByText('10 / 120')).toBeInTheDocument()
  })

  it('turns destructive below minlength, once something is typed', () => {
    render(Textarea, { maxlength: 120, minlength: 20, value: 'Too short', 'aria-label': 'Notes' })

    const counter = screen.getByText('9 / 20 minimum')

    expect(counter).toHaveClass('text-destructive')
  })

  it('leaves an empty field alone, even with a minimum', () => {
    render(Textarea, { maxlength: 120, minlength: 20, 'aria-label': 'Notes' })

    expect(screen.getByText('0 / 120')).not.toHaveClass('text-destructive')
  })

  it('passes aria-invalid through', () => {
    render(Textarea, { 'aria-invalid': true, 'aria-label': 'Notes' })

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})
