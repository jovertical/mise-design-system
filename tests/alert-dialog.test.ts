import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import CloseLocationAlert from './fixtures/close-location-alert.svelte'

const state = () => screen.getByTestId('state')

describe('AlertDialog', () => {
  it('opens an alertdialog with its title and description', async () => {
    render(CloseLocationAlert)
    await userEvent.click(screen.getByRole('button', { name: 'Close location' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveAccessibleName('Close Riverside?')
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.')
    expect(dialog).toHaveAttribute('data-size', 'default')
  })

  it('draws Cancel and the action as Buttons, keeping their own slots', async () => {
    render(CloseLocationAlert, { open: true })
    const cancel = await screen.findByRole('button', { name: 'Cancel' })
    const action = screen.getByRole('button', { name: 'Close it' })
    expect(cancel).toHaveAttribute('data-slot', 'alert-dialog-cancel')
    expect(cancel).toHaveAttribute('data-variant', 'outline')
    expect(action).toHaveAttribute('data-slot', 'alert-dialog-action')
    expect(action).toHaveClass('bg-destructive')
  })

  it('closes from Cancel', async () => {
    render(CloseLocationAlert, { open: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(state()).toHaveTextContent('closed'))
  })

  it('runs the action and closes', async () => {
    render(CloseLocationAlert, { open: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Close it' }))
    await waitFor(() => expect(state()).toHaveTextContent('closed confirmed'))
  })

  it('closes on Escape', async () => {
    render(CloseLocationAlert, { open: true })
    await screen.findByRole('alertdialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(state()).toHaveTextContent('closed'))
  })

  it('stays open when the action handler prevents the close', async () => {
    render(CloseLocationAlert, { open: true, holdOpen: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Close it' }))
    expect(state()).toHaveTextContent('open confirmed')
  })
})
