import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import SwitchFieldHarness from './fixtures/switch-field-harness.svelte'

const root = () => document.querySelector('[data-slot="switch-field"]') as HTMLElement

describe('SwitchField', () => {
  it('names the switch by its label, with the description beside it', () => {
    render(SwitchFieldHarness)

    const toggle = screen.getByRole('switch', { name: 'Collect tax at this location' })

    expect(toggle).toHaveAttribute('id', 'collect-tax')
    expect(screen.getByText('Applies the default rate unless overridden.')).toBeInTheDocument()
  })

  it('toggles once from a click on its label, and binds checked', async () => {
    render(SwitchFieldHarness)

    await userEvent.click(screen.getByText('Collect tax at this location'))

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByTestId('checked')).toHaveTextContent('on')
    expect(root()).toHaveAttribute('data-state', 'checked')
  })

  it('reveals its content only while on, unmounted while off', async () => {
    render(SwitchFieldHarness)

    expect(screen.queryByText('Override fields')).toBeNull()

    await userEvent.click(screen.getByRole('switch'))

    expect(screen.getByText('Override fields').parentElement).toHaveClass('border-t', 'px-4')

    await userEvent.click(screen.getByRole('switch'))

    expect(screen.queryByText('Override fields')).toBeNull()
  })

  it('draws its own surface by default, accented when on', () => {
    render(SwitchFieldHarness, { checked: true })

    expect(root()).toHaveClass('rounded-2xl', 'border', 'data-[state=checked]:border-primary')
  })

  it('drops the surface when flush and indents what it reveals', () => {
    render(SwitchFieldHarness, { checked: true, variant: 'flush' })

    expect(root()).not.toHaveClass('rounded-2xl')
    expect(root()).not.toHaveClass('border')
    expect(screen.getByText('Override fields').parentElement).toHaveClass('border-l', 'pl-4')
  })

  it('dims and disables', () => {
    render(SwitchFieldHarness, { disabled: true })

    expect(root()).toHaveClass('opacity-60')
    expect(screen.getByRole('switch')).toBeDisabled()
  })
})
