import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ChannelGroup from './fixtures/channel-group.svelte'
import MultiplierGroup from './fixtures/multiplier-group.svelte'

describe('ToggleGroup', () => {
  it('keeps one option on in a single group and binds the value', async () => {
    render(MultiplierGroup)
    expect(screen.getByRole('radio', { name: '1x' })).toHaveAttribute('data-state', 'on')
    await userEvent.click(screen.getByRole('radio', { name: '2x' }))
    expect(screen.getByRole('radio', { name: '2x' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '1x' })).toHaveAttribute('data-state', 'off')
    expect(screen.getByTestId('value')).toHaveTextContent('2')
  })

  it('draws a segmented group as the washed track, with pill items', () => {
    const { container } = render(MultiplierGroup)
    const group = container.querySelector('[data-slot="toggle-group"]')
    expect(group).toHaveClass('rounded-full', 'bg-black/5')
    expect(screen.getByRole('radio', { name: '1x' })).toHaveAttribute('data-variant', 'segmented')
    expect(screen.getByRole('radio', { name: '1x' })).not.toHaveClass(
      'data-[spacing=0]:rounded-none',
    )
  })

  // `flex-1` gave every item a zero basis, so in a `w-fit` track a longer label
  // got the same share as "2x" and overflowed its pill.
  it('sizes segmented items from their own content', () => {
    render(MultiplierGroup)
    const item = screen.getByRole('radio', { name: '1.5x' })
    expect(item).toHaveClass('flex-auto')
    expect(item).not.toHaveClass('flex-1')
  })

  it('collects several values in a multiple group', async () => {
    render(ChannelGroup)
    await userEvent.click(screen.getByRole('button', { name: 'Online' }))
    expect(screen.getByRole('button', { name: 'Online' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('value')).toHaveTextContent('counter,online')
  })

  it('hands the group variant to its items', () => {
    render(ChannelGroup)
    const item = screen.getByRole('button', { name: 'Counter' })
    expect(item).toHaveAttribute('data-variant', 'outline')
    expect(item).toHaveClass('border-input', 'data-[spacing=0]:rounded-none')
  })
})
