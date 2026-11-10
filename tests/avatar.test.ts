import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import AvatarFallbackHarness from './fixtures/avatar-fallback-harness.svelte'
import TeamAvatar from './fixtures/team-avatar.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement | null

describe('Avatar', () => {
  it('shows the fallback while the image has not loaded', () => {
    const { container } = render(TeamAvatar)

    expect(screen.getByText('AC')).toHaveAttribute('data-slot', 'avatar-fallback')
    expect(slot(container, 'avatar')).toHaveClass('rounded-full', 'size-10')
  })

  it('wraps the avatar with no dot while offline', () => {
    const { container } = render(TeamAvatar)

    expect(slot(container, 'avatar-status')).not.toHaveAttribute('data-online')
    expect(slot(container, 'presence-dot')).toBeNull()
  })

  it('adds a labelled presence dot while online', () => {
    const { container } = render(TeamAvatar, { isOnline: true })

    expect(slot(container, 'avatar-status')).toHaveAttribute('data-online', 'true')
    expect(slot(container, 'presence-dot')).toHaveClass('absolute', 'right-0', 'bottom-0')
    expect(screen.getByText('Has this order open')).toHaveClass('sr-only')
  })
})

describe('the neutral wash', () => {
  // bg-muted is the canvas colour, so a neutral fill in it vanished on the page.
  it('fills an avatar fallback with the foreground wash, not muted', () => {
    render(AvatarFallbackHarness)

    const fallback = document.querySelector('[data-slot="avatar-fallback"]') as HTMLElement

    expect(fallback).toHaveClass('bg-foreground/[0.07]')
    expect(fallback).not.toHaveClass('bg-muted')
  })
})
