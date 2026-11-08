import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import ErrorStateHarness from './fixtures/error-state-harness.svelte'

describe('ErrorState', () => {
  it('is a statement with nothing below it when given no way forward', () => {
    render(ErrorStateHarness)
    expect(screen.getByText('Maintenance')).toHaveClass('font-semibold')
    expect(screen.queryByRole('button')).toBeNull()
    expect(document.querySelector('[data-slot="empty-content"]')).toBeNull()
  })

  it('draws the status, the icon, actions, Back and Home, in that order', () => {
    render(ErrorStateHarness, { full: true })
    expect(screen.getByText('403')).toHaveClass('tracking-widest')
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    const order = [...(document.querySelector('[data-slot="empty-content"]')?.children ?? [])].map(
      (child) => child.textContent?.trim(),
    )
    expect(order).toEqual(['Try again', 'Go Back', 'Back to locations'])
    expect(screen.getByRole('link', { name: 'Back to locations' })).toHaveAttribute(
      'href',
      '/locations',
    )
  })

  it('goes back through history', async () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    render(ErrorStateHarness, { full: true })
    await userEvent.click(screen.getByRole('button', { name: 'Go Back' }))
    expect(back).toHaveBeenCalledOnce()
    back.mockRestore()
  })
})
