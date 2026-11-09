// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { ThemeState } from '../src/lib/components/actions/theme-toggle/theme.svelte.js'

/**
 * An app that renders on the server (Inertia SSR, SvelteKit) builds the theme
 * state and reads `resolved` where there is no `window`: ThemeToggle derives
 * its icon and label from it during the render. The server cannot know the
 * system scheme, so it resolves to light and the browser corrects it on mount.
 *
 * Svelte resolves to its browser build in every test file here, so this checks
 * the state class rather than a full server render.
 */
describe('ThemeState on the server', () => {
  it('resolves the system theme to light without a window', () => {
    expect(typeof window).toBe('undefined')

    const state = new ThemeState('mise-test-theme', 'system')

    expect(state.resolved).toBe('light')
  })

  it('resolves an explicit default as given', () => {
    expect(new ThemeState('mise-test-theme', 'dark').resolved).toBe('dark')
  })
})
