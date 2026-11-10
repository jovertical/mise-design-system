import { render, screen, waitFor } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Hint } from '../src/lib/index.js'
import { text } from './snippet.js'

describe('Hint', () => {
  it('is a button named by its label', () => {
    render(Hint, { label: 'How stock health is calculated', children: text('Explained') })

    const button = screen.getByRole('button', { name: 'How stock health is calculated' })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-slot', 'tooltip-trigger')
    expect(button).toHaveClass('size-4', 'rounded-full', 'text-muted-foreground')
  })

  it('falls back to "More info" without a label', () => {
    render(Hint, { children: text('Explained') })

    expect(screen.getByRole('button', { name: 'More info' })).toBeInTheDocument()
  })

  it('opens its explanation when the button takes keyboard focus', async () => {
    render(Hint, { label: 'Why', children: text('Counted from the first sync') })

    expect(screen.queryByText('Counted from the first sync')).toBeNull()

    screen.getByRole('button', { name: 'Why' }).focus()

    const content = await screen.findByText('Counted from the first sync')

    await waitFor(() =>
      expect(content.closest('[data-slot="tooltip-content"]')).toHaveClass(
        'max-w-xs',
        'text-balance',
      ),
    )
  })
})
