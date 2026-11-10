import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import ApprovalAlert from './fixtures/approval-alert.svelte'

describe('Alert', () => {
  it('is announced as an alert, on the card surface by default', () => {
    render(ApprovalAlert)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveAttribute('data-slot', 'alert')
    expect(alert).toHaveClass('bg-card', 'border')
  })

  it('carries the status on the soft surface, not the text', () => {
    render(ApprovalAlert, { variant: 'warning' })

    const alert = screen.getByRole('alert')

    expect(alert).toHaveClass('bg-warning-soft')
    expect(screen.getByText(/Price change/)).toHaveClass('text-muted-foreground')
  })

  it('reads the info icon dark step from the role ramp', () => {
    render(ApprovalAlert, { variant: 'info' })

    expect(screen.getByRole('alert')).toHaveClass('dark:[&>svg]:text-[var(--color-info-400)]')
  })

  it('places the action in its own slot', () => {
    render(ApprovalAlert)

    const action = screen.getByRole('button', { name: 'Review' }).parentElement as HTMLElement

    expect(action).toHaveAttribute('data-slot', 'alert-action')
    expect(action).toHaveClass('sm:col-start-3')
  })

  it.each([
    ['critical', 'bg-destructive-soft'],
    ['warning', 'bg-warning-soft'],
    ['success', 'bg-success-soft'],
    ['info', 'bg-info-soft'],
    ['primary', 'bg-info-soft'],
    ['neutral', 'bg-card'],
  ] as const)('takes tone %s, the vocabulary every other component uses', (tone, surface) => {
    render(ApprovalAlert, { tone })

    const alert = screen.getByRole('alert')

    expect(alert).toHaveClass(surface)
    expect(alert).toHaveAttribute('data-tone', tone)
  })

  it('still draws variant="destructive" as critical', () => {
    render(ApprovalAlert, { variant: 'destructive' })

    expect(screen.getByRole('alert')).toHaveClass('bg-destructive-soft')
  })
})
