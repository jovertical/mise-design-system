import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import BoundToggle from './fixtures/bound-toggle.svelte'

const toggle = () => screen.getByRole('button', { name: 'Late orders only' })

describe('Toggle', () => {
  it('presses on click and binds the value back', async () => {
    render(BoundToggle)
    expect(toggle()).toHaveAttribute('aria-pressed', 'false')
    expect(toggle()).toHaveAttribute('data-state', 'off')
    await userEvent.click(toggle())
    expect(toggle()).toHaveAttribute('aria-pressed', 'true')
    expect(toggle()).toHaveAttribute('data-state', 'on')
    expect(screen.getByTestId('state')).toHaveTextContent('on')
  })

  it('draws the default size and variant from the React map', () => {
    render(BoundToggle)
    expect(toggle()).toHaveAttribute('data-slot', 'toggle')
    expect(toggle()).toHaveClass('h-9', 'bg-transparent')
  })

  it('keys the solid fill off aria-pressed', () => {
    render(BoundToggle, { variant: 'solid', pressed: true })
    expect(toggle()).toHaveClass('aria-pressed:bg-primary')
  })

  it('draws an icon-only toggle as a circle of the size', () => {
    render(BoundToggle, { iconOnly: true, size: 'sm' })
    expect(toggle()).toHaveAttribute('data-icon-only', 'true')
    expect(toggle()).toHaveClass('rounded-full', 'size-8')
  })

  it('ignores clicks when disabled', async () => {
    render(BoundToggle, { disabled: true })
    await userEvent.click(toggle())
    expect(toggle()).toHaveAttribute('aria-pressed', 'false')
  })
})
