import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import InputOTPHarness from './fixtures/input-otp-harness.svelte'

// bits-ui's PinInput re-syncs the hidden input on timers 0, 10 and 50ms after
// each value change. Let them run before the file's jsdom is torn down, or they
// fire into a dead realm and Vitest reports them as unhandled errors.
afterEach(() => new Promise((resolve) => setTimeout(resolve, 60)))

const slots = () => [...document.querySelectorAll('[data-slot="input-otp-slot"]')] as HTMLElement[]

describe('InputOTP', () => {
  it('draws one slot per cell, split into groups by a separator', () => {
    render(InputOTPHarness)
    expect(slots()).toHaveLength(6)
    expect(document.querySelectorAll('[data-slot="input-otp-group"]')).toHaveLength(2)
    expect(screen.getByRole('separator')).toHaveAttribute('data-slot', 'input-otp-separator')
  })

  it('fills the slots in order as it is typed into, and binds value', async () => {
    render(InputOTPHarness)
    await userEvent.click(screen.getByRole('textbox', { name: 'Verification code' }))
    await userEvent.keyboard('4821')
    expect(slots().map((slot) => slot.textContent?.trim())).toEqual(['4', '8', '2', '1', '', ''])
    expect(screen.getByTestId('value')).toHaveTextContent('4821')
  })

  it('fills from a paste', async () => {
    render(InputOTPHarness)
    await userEvent.click(screen.getByRole('textbox', { name: 'Verification code' }))
    await userEvent.paste('739104')
    expect(screen.getByTestId('value')).toHaveTextContent('739104')
    expect(slots().at(-1)).toHaveTextContent('4')
  })

  it('draws a dot, never the character, when masked', () => {
    render(InputOTPHarness, { value: '12', masked: true })
    expect(slots()[0].querySelector('[data-slot="input-otp-dot"]')).not.toBeNull()
    expect(slots()[0]).not.toHaveTextContent('1')
    expect(slots()[2].querySelector('[data-slot="input-otp-dot"]')).toBeNull()
  })

  it('draws the field as one box that rings while the hidden input has focus', () => {
    render(InputOTPHarness)
    const group = document.querySelector('[data-slot="input-otp-group"]') as HTMLElement
    expect(group).toHaveClass(
      'bg-input/50',
      'rounded-2xl',
      'group-focus-within/input-otp:ring-[3px]',
    )
    expect(slots()[1]).toHaveClass(
      'border-l',
      'first:border-l-0',
      'data-[active=true]:bg-foreground/5',
    )
  })
})
