import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import DialogHarness from './fixtures/dialog-harness.svelte'

describe('Dialog', () => {
  it('opens from its trigger, rendered through the child snippet as a Button', async () => {
    render(DialogHarness)

    const trigger = screen.getByRole('button', { name: 'Close the shift' })

    // The trigger's props land on the Button through `child`, as Radix's Slot
    // merged them under `asChild`: the slot is the trigger's, the look is Button's.
    expect(trigger).toHaveAttribute('data-slot', 'dialog-trigger')
    expect(trigger).toHaveClass('bg-primary')

    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')

    expect(dialog).toHaveAttribute('data-slot', 'dialog-content')
    expect(dialog).toHaveAccessibleName('Close the morning shift?')
    expect(dialog).toHaveAccessibleDescription('Open orders move to the next shift.')
    expect(screen.getByTestId('open')).toHaveTextContent('open')
  })

  it('defaults to the lg width and takes a size', async () => {
    render(DialogHarness, { open: true, size: 'md' })

    const dialog = await screen.findByRole('dialog')

    expect(dialog).toHaveAttribute('data-size', 'md')
    expect(dialog).toHaveClass('sm:max-w-md')
  })

  it('closes from the corner close button', async () => {
    render(DialogHarness, { open: true })

    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))

    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })

  it('closes from a DialogClose in the footer', async () => {
    render(DialogHarness, { open: true })

    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))

    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })

  it('closes on Escape', async () => {
    render(DialogHarness, { open: true })

    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })

  it('leaves the corner button out when asked', async () => {
    render(DialogHarness, { open: true, showCloseButton: false })

    await screen.findByRole('dialog')

    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
  })
})
