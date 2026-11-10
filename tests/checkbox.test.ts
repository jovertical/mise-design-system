import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import BoundCheckbox from './fixtures/bound-checkbox.svelte'

const indicatorIcon = (container: HTMLElement) =>
  container.querySelector('[data-slot="checkbox-indicator"] svg')

describe('Checkbox', () => {
  it('renders an unchecked checkbox labelled by its Label', () => {
    render(BoundCheckbox)

    const box = screen.getByRole('checkbox', { name: 'Stock count done' })

    expect(box).toHaveAttribute('data-slot', 'checkbox')
    expect(box).toHaveAttribute('data-state', 'unchecked')
    expect(box).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles on click and binds the value back', async () => {
    render(BoundCheckbox)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
    expect(screen.getByTestId('state')).toHaveTextContent('checked')
  })

  it('toggles from its label', async () => {
    render(BoundCheckbox)

    await userEvent.click(screen.getByText('Stock count done'))

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('shows the indicator only when checked or indeterminate', () => {
    const { container, unmount } = render(BoundCheckbox)

    expect(indicatorIcon(container)).toBeNull()

    unmount()

    expect(indicatorIcon(render(BoundCheckbox, { checked: true }).container)).not.toBeNull()
  })

  it('reports the indeterminate state', () => {
    render(BoundCheckbox, { indeterminate: true })

    const box = screen.getByRole('checkbox')

    expect(box).toHaveAttribute('data-state', 'indeterminate')
    expect(box).toHaveAttribute('aria-checked', 'mixed')
  })

  it('ignores clicks when disabled', async () => {
    render(BoundCheckbox, { disabled: true })

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked')
  })
})
