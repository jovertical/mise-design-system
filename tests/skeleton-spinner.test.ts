import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Skeleton, Spinner } from '../src/lib/index.js'
import CaptionedSpinner from './fixtures/captioned-spinner.svelte'

describe('Skeleton', () => {
  it('pulses as a neutral wash, not the brand tint, in the shape it is given', () => {
    const { container } = render(Skeleton, { class: 'h-4 w-32' })
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('bg-foreground/10', 'animate-pulse', 'h-4', 'w-32')
    expect(skeleton).not.toHaveClass('bg-accent')
  })
})

describe('Spinner', () => {
  it('announces itself as a loading status', () => {
    render(Spinner)
    expect(screen.getByRole('status', { name: 'Loading' })).toHaveClass('animate-spin', 'size-4')
  })

  it('lets a caller resize it and relabel it', () => {
    render(Spinner, { class: 'size-6', 'aria-label': 'Syncing stock' })
    const spinner = screen.getByRole('status', { name: 'Syncing stock' })
    expect(spinner).toHaveClass('size-6')
    expect(spinner).not.toHaveClass('size-4')
  })

  /*
   * `status` takes its name from the author only, never from its content, so
   * the caption is what the live region announces, not its name.
   */
  it('takes a caption, which the status announces in place of "Loading"', () => {
    render(CaptionedSpinner)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Checking stock at every location')
    expect(status).not.toHaveAttribute('aria-label')
    expect(status.tagName).toBe('SPAN')
    expect(status).toHaveClass('text-muted-foreground', 'text-sm')
    const icon = status.querySelector('svg')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).not.toHaveAttribute('role')
    expect(icon).toHaveClass('animate-spin')
  })
})
