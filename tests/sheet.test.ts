import { render, screen, waitFor } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import OrderSheet from './fixtures/order-sheet.svelte'

describe('Sheet', () => {
  it('opens a dialog from the right by default', async () => {
    render(OrderSheet)
    await userEvent.click(screen.getByRole('button', { name: 'Open panel' }))
    const sheet = await screen.findByRole('dialog')
    expect(sheet).toHaveAccessibleName('Order 2041')
    expect(sheet).toHaveAttribute('data-side', 'right')
    expect(sheet).toHaveClass('right-0', 'border-l')
  })

  it('anchors to the side it is given', async () => {
    render(OrderSheet, { open: true, side: 'left' })
    const sheet = await screen.findByRole('dialog')
    expect(sheet).toHaveAttribute('data-side', 'left')
    expect(sheet).toHaveClass('left-0', 'border-r')
  })

  it('closes from the corner button, a SheetClose and Escape', async () => {
    const { rerender } = render(OrderSheet, { open: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))

    await rerender({ open: true })
    await userEvent.click(await screen.findByRole('button', { name: 'Done' }))
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))

    await rerender({ open: true })
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByTestId('open')).toHaveTextContent('closed'))
  })
})
