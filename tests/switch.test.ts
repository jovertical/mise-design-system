import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import BoundSwitch from './fixtures/bound-switch.svelte'

const thumb = (container: HTMLElement) =>
  container.querySelector('[data-slot="switch-thumb"]') as HTMLElement

describe('Switch', () => {
  it('renders an unchecked switch labelled by its Label', () => {
    const { container } = render(BoundSwitch)
    const control = screen.getByRole('switch', { name: 'Compare to previous shift' })

    expect(control).toHaveAttribute('data-slot', 'switch')
    expect(control).toHaveAttribute('aria-checked', 'false')
    expect(control).toHaveAttribute('data-state', 'unchecked')
    expect(thumb(container)).toHaveAttribute('data-state', 'unchecked')
  })

  it('toggles on click and binds the value back', async () => {
    const { container } = render(BoundSwitch)

    await userEvent.click(screen.getByRole('switch'))

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
    expect(thumb(container)).toHaveAttribute('data-state', 'checked')
    expect(screen.getByTestId('state')).toHaveTextContent('on')
  })

  it('toggles from its label', async () => {
    render(BoundSwitch)

    await userEvent.click(screen.getByText('Compare to previous shift'))

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('ignores clicks when disabled', async () => {
    render(BoundSwitch, { disabled: true })

    await userEvent.click(screen.getByRole('switch'))

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })
})
