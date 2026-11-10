import { fireEvent, render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import CommandTriggerHarness from './fixtures/command-trigger-harness.svelte'

const trigger = () => screen.getByRole('button')
const state = () => screen.getByTestId('open')

describe('CommandTrigger', () => {
  it('is a filled, input-shaped button with a search icon and a label', () => {
    render(CommandTriggerHarness)

    expect(trigger()).toHaveAccessibleName(/type to search/i)
    expect(trigger()).toHaveAttribute('data-slot', 'command-trigger')
    expect(trigger()).toHaveClass('bg-input/50', 'rounded-2xl', 'h-9')
    expect(trigger().querySelector('svg')).toHaveClass('tabler-icon-search')
  })

  it('takes its own label', () => {
    render(CommandTriggerHarness, { label: 'Search orders…' })

    expect(trigger()).toHaveTextContent('Search orders…')
    expect(trigger()).not.toHaveTextContent('Type to search')
  })

  it('shows the shortcut and announces it', () => {
    render(CommandTriggerHarness)

    expect(trigger().querySelector('kbd')).toHaveTextContent(/K$/)
    expect(trigger()).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K')
  })

  it('opens on click', async () => {
    render(CommandTriggerHarness)

    await userEvent.click(trigger())

    expect(state()).toHaveTextContent('open')
  })

  it('toggles on ⌘K and Ctrl K', async () => {
    render(CommandTriggerHarness)

    await fireEvent.keyDown(window, { key: 'k', metaKey: true })

    expect(state()).toHaveTextContent('open')

    await fireEvent.keyDown(window, { key: 'K', ctrlKey: true })

    expect(state()).toHaveTextContent('closed')
  })

  it('ignores the key without a modifier', async () => {
    render(CommandTriggerHarness)

    await fireEvent.keyDown(window, { key: 'k' })

    expect(state()).toHaveTextContent('closed')
  })

  it('registers nothing and shows no hint when hotkey is false', async () => {
    render(CommandTriggerHarness, { hotkey: false })

    await fireEvent.keyDown(window, { key: 'k', metaKey: true })

    expect(state()).toHaveTextContent('closed')
    expect(trigger().querySelector('kbd')).toBeNull()
    expect(trigger()).not.toHaveAttribute('aria-keyshortcuts')
  })

  it("lets the caller's onclick cancel the toggle", async () => {
    const onclick = vi.fn((event: MouseEvent) => event.preventDefault())

    render(CommandTriggerHarness, { onclick })

    await userEvent.click(trigger())

    expect(onclick).toHaveBeenCalledOnce()
    expect(state()).toHaveTextContent('closed')
  })
})
