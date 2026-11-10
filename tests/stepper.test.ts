import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { type StepDefinition, Stepper } from '../src/lib/index.js'

const STEPS: StepDefinition[] = [
  { id: 'info', name: 'Location info', description: 'Name and address' },
  { id: 'tax', name: 'Tax', description: 'Registration status' },
  { id: 'staff', name: 'Staff', description: 'Invite the team' },
  { id: 'done', name: 'Review', description: 'Check and finish' },
]

const current = () => document.querySelector('[aria-current="step"]') as HTMLElement

describe('Stepper', () => {
  it('completes every step before the current one by default', () => {
    render(Stepper, { steps: STEPS, currentStepId: 'staff' })

    const names = [...document.querySelectorAll('li p:first-child')]

    expect(names[0]).toHaveClass('text-primary')
    expect(names[1]).toHaveClass('text-primary')
    expect(names[2]).toHaveClass('text-foreground')
    expect(names[3]).toHaveClass('text-muted-foreground')
    expect(current()).toHaveTextContent('3')
  })

  it('takes explicit completion over position', () => {
    render(Stepper, { steps: STEPS, currentStepId: 'staff', completedSteps: ['info'] })

    const names = [...document.querySelectorAll('li p:first-child')]

    expect(names[0]).toHaveClass('text-primary')
    expect(names[1]).toHaveClass('text-muted-foreground')
  })

  it('names each variant on its root', () => {
    for (const variant of ['vertical', 'horizontal', 'condensed', 'compact'] as const) {
      const { unmount } = render(Stepper, { steps: STEPS, currentStepId: 'tax', variant })

      expect(document.querySelector('[data-slot="stepper"]')).toHaveAttribute(
        'data-variant',
        variant,
      )

      unmount()
    }
  })

  it('names only the current step under condensed chips, and drops it on request', () => {
    const { unmount } = render(Stepper, {
      steps: STEPS,
      currentStepId: 'tax',
      variant: 'condensed',
    })

    expect(screen.getByText('Registration status')).toBeInTheDocument()
    expect(screen.queryByText('Invite the team')).toBeNull()
    expect(current()).toHaveClass('ring-2')

    unmount()

    render(Stepper, {
      steps: STEPS,
      currentStepId: 'tax',
      variant: 'condensed',
      showCurrentStep: false,
    })

    expect(screen.queryByText('Registration status')).toBeNull()
  })

  it('reads out progress and draws its bar in compact, unless told not to', () => {
    const { unmount } = render(Stepper, { steps: STEPS, currentStepId: 'tax', variant: 'compact' })

    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()

    const bar = screen.getByRole('progressbar', { name: 'Progress' })

    expect(bar).toHaveAttribute('aria-valuenow', '2')
    expect(bar.firstElementChild).toHaveStyle({ width: '50%' })

    unmount()

    render(Stepper, { steps: STEPS, currentStepId: 'tax', variant: 'compact', showProgress: false })

    expect(screen.queryByRole('progressbar')).toBeNull()
    expect(screen.getByText('Tax')).toBeInTheDocument()
  })

  it('makes only the selectable steps buttons, in every variant but compact', async () => {
    for (const variant of ['vertical', 'horizontal', 'condensed'] as const) {
      const onStepSelect = vi.fn()

      const { unmount } = render(Stepper, {
        steps: STEPS,
        currentStepId: 'staff',
        variant,
        onStepSelect,
        selectableSteps: ['info', 'tax'],
      })

      expect(
        screen.getAllByRole('button').map((button) => button.getAttribute('aria-label')),
      ).toEqual(['Go to Location info', 'Go to Tax'])

      await userEvent.click(screen.getByRole('button', { name: 'Go to Tax' }))

      expect(onStepSelect).toHaveBeenCalledWith('tax')

      unmount()
    }
  })

  // bg-muted vanished on the muted canvas a stepper sits on; a foreground wash
  // reads on the page and on a card alike.
  it('washes unreached steps and the compact track with the foreground, not muted', () => {
    const { unmount } = render(Stepper, {
      steps: STEPS,
      currentStepId: 'tax',
      variant: 'condensed',
    })

    expect(screen.getByText('Review').parentElement).toHaveClass('bg-foreground/[0.07]')

    unmount()

    render(Stepper, { steps: STEPS, currentStepId: 'tax', variant: 'compact' })

    expect(screen.getByRole('progressbar')).toHaveClass('bg-foreground/[0.07]')
  })

  it('reports progress only, with no buttons, without onStepSelect', () => {
    render(Stepper, { steps: STEPS, currentStepId: 'staff', variant: 'horizontal' })

    expect(screen.queryAllByRole('button')).toEqual([])
  })
})
