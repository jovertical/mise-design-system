import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import Probe from './fixtures/probe.svelte'

/**
 * Proves the Svelte compiler, jsdom, Testing Library and jest-dom are wired
 * together. Every other component test depends on this chain.
 */
describe('toolchain', () => {
  it('renders a Svelte 5 component and reacts to an event', async () => {
    render(Probe, { props: { label: 'Orders' } })

    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('button')).toHaveTextContent('Orders: 1')
  })
})
