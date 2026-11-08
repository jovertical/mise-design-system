import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import * as formEntry from '../src/lib/form.js'
import * as mainEntry from '../src/lib/index.js'
import FormHarness from './fixtures/form-harness.svelte'

const FORM_EXPORTS = [
  'Form',
  'FormButton',
  'FormControl',
  'FormDescription',
  'FormElementField',
  'FormField',
  'FormFieldErrors',
  'FormFieldset',
  'FormLabel',
  'FormLegend',
]

describe('Form', () => {
  it('labels its control and describes it', () => {
    render(FormHarness)
    const control = screen.getByRole('textbox', { name: /Location name/ })
    expect(control).toHaveAccessibleDescription(/Shown on receipts/)
    expect(document.querySelector('[data-slot="form-item"]')).toHaveClass('space-y-2')
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows the validation errors and marks the control invalid', async () => {
    render(FormHarness)
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(screen.getByText('A location name is required.')).toBeInTheDocument(),
    )
    const control = screen.getByRole('textbox', { name: /Location name/ })
    expect(control).toHaveAttribute('aria-invalid', 'true')
    expect(document.querySelector('[data-slot="form-label"]')).toHaveAttribute('data-fs-error')
    expect(screen.getByText('A location name is required.').parentElement).toHaveClass(
      'text-destructive',
      'font-medium',
    )
  })
})

describe('the mise/form entry', () => {
  it('provides every Form part', () => {
    expect(FORM_EXPORTS.filter((name) => !(name in formEntry))).toEqual([])
  })

  it('keeps Form out of the main barrel, so plain Vite apps never load superforms', () => {
    expect(Object.keys(mainEntry).filter((name) => /^Form($|[A-Z])/.test(name))).toEqual([])
  })
})
