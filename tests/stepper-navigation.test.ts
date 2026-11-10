import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import StepperNavigationHarness from './fixtures/stepper-navigation-harness.svelte'

const row = () => document.querySelector('[data-slot="stepper-navigation"]') as HTMLElement

describe('StepperNavigation', () => {
  it('calls back and next', async () => {
    const onBack = vi.fn()
    const onNext = vi.fn()

    render(StepperNavigationHarness, { onBack, onNext })

    await userEvent.click(screen.getByRole('button', { name: 'Back' }))

    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(onBack).toHaveBeenCalledOnce()
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('holds the left end on the first step, so Next does not move', () => {
    render(StepperNavigationHarness, { onNext: () => {} })

    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull()
    expect(row().firstElementChild).toHaveClass('hidden', 'sm:block')
    expect(row().lastElementChild).toContainElement(screen.getByRole('button', { name: 'Next' }))
  })

  it('draws a spinner while submitting, and disables on request', () => {
    render(StepperNavigationHarness, { onNext: () => {}, nextLoading: true, nextDisabled: true })

    const next = screen.getByRole('button', { name: 'Next' })

    expect(next).toBeDisabled()
    expect(next.querySelector('.animate-spin')).not.toBeNull()
  })

  it('puts leading at the far left and trailing beside Next', () => {
    render(StepperNavigationHarness, {
      onBack: () => {},
      onNext: () => {},
      withLeading: true,
      withTrailing: true,
    })

    const [left, right] = [...row().children]

    expect(left).toContainElement(screen.getByRole('button', { name: 'Cancel' }))
    expect(right.firstElementChild).toBe(screen.getByRole('button', { name: 'Skip this step' }))
    expect(right.lastElementChild).toBe(screen.getByRole('button', { name: 'Next' }))
  })
})
