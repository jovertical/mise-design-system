import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import CommandFixture from './fixtures/command.svelte'

const item = (text: string) => screen.getByText(text).closest('[data-slot="command-item"]')

describe('Command', () => {
  it('is a popover surface with a search input, headed groups and items', () => {
    const { container } = render(CommandFixture)

    expect(container.querySelector('[data-slot="command"]')).toHaveClass(
      'bg-popover',
      'rounded-2xl',
    )

    expect(screen.getByPlaceholderText('Search for a command…')).toHaveAttribute(
      'data-slot',
      'command-input',
    )

    expect(screen.getByText('Navigate')).toHaveClass('text-muted-foreground', 'text-xs')
    expect(screen.getByText('⌘O')).toHaveAttribute('data-slot', 'command-shortcut')
  })

  it('filters the items by what is typed, and says so when nothing matches', async () => {
    render(CommandFixture)

    const input = screen.getByPlaceholderText('Search for a command…')

    await userEvent.type(input, 'loca')

    expect(item('Locations')).not.toHaveAttribute('hidden')
    expect(screen.queryByText('Orders')).toBeNull()

    await userEvent.clear(input)

    await userEvent.type(input, 'zzz')

    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('marks a disabled item so it cannot be picked', () => {
    render(CommandFixture)

    expect(item('Settings')).toHaveAttribute('data-disabled')
    expect(item('Settings')).toHaveClass('data-disabled:opacity-50')
  })

  it('opens in a dialog, titled for a screen reader only', () => {
    render(CommandFixture, { dialog: true })

    const dialog = screen.getByRole('dialog', { name: 'Command palette' })

    expect(dialog.querySelector('[data-slot="command"]')).not.toBeNull()
  })
})
