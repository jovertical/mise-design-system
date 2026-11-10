import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import ThemeContextByKeyHarness from './fixtures/theme-context-by-key-harness.svelte'
import ThemeToggleHarness from './fixtures/theme-toggle-harness.svelte'

const realMatchMedia = window.matchMedia

const prefersDark = (dark: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: dark && query.includes('dark'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

const root = () => document.documentElement

afterEach(() => {
  window.matchMedia = realMatchMedia

  localStorage.clear()

  root().classList.remove('light', 'dark')
})

describe('ThemeProvider and ThemeToggle', () => {
  it.each([
    [true, 'dark', 'Switch to light theme'],
    [false, 'light', 'Switch to dark theme'],
  ])('resolves system against prefers-color-scheme (dark: %s)', (dark, cls, label) => {
    prefersDark(dark)

    render(ThemeToggleHarness)

    expect(root()).toHaveClass(cls)
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
  })

  it('flips a first click from system to the opposite of what it resolved to, and stores it', async () => {
    prefersDark(true)

    render(ThemeToggleHarness)

    await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(root()).toHaveClass('light')
    expect(root()).not.toHaveClass('dark')
    expect(localStorage.getItem('mise-test-theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument()
  })

  it('reads a stored choice over the default', () => {
    prefersDark(false)

    localStorage.setItem('mise-test-theme', 'dark')

    render(ThemeToggleHarness, { defaultTheme: 'light' })

    expect(root()).toHaveClass('dark')
  })

  it('finds a provider set by another copy of mise, through the registered symbol', () => {
    render(ThemeContextByKeyHarness)

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })
})
