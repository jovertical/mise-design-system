/**
 * Origin: the React package 2.23.0 `use-theme.tsx` (`ThemeProviderState`, `useTheme`), in its hooks folder
 * Diverged: a rune-backed state shared through Svelte's context, for React's
 *   context and hook (round 8 plan, R8-6). It reads `localStorage` and
 *   `matchMedia` only in a browser, so a server render gets the default, and
 *   `system` resolves to light, rather than a crash.
 */
import { getContext, setContext } from 'svelte'

export type Theme = 'dark' | 'light' | 'system'

// Registered, as the sidebar's is, so two loaded copies of mise (a dev server
// across a version bump, a linked package) share one provider.
const KEY = Symbol.for('mise-theme')

/** The chosen theme, persisted under `storageKey`. */
export class ThemeState {
  #storageKey: string
  #theme = $state<Theme>('system')

  constructor(storageKey: string, defaultTheme: Theme) {
    this.#storageKey = storageKey

    const stored =
      typeof localStorage === 'undefined'
        ? null
        : (localStorage.getItem(storageKey) as Theme | null)

    this.#theme = stored || defaultTheme
  }

  get theme(): Theme {
    return this.#theme
  }

  setTheme = (next: Theme) => {
    localStorage.setItem(this.#storageKey, next)

    this.#theme = next
  }

  /**
   * `system` resolved against `prefers-color-scheme`. Read on demand rather
   * than subscribed to: a theme that changes under the user mid-session is
   * more surprising than one that settles at load. A server render cannot
   * know the system scheme, so there it is light until the browser mounts.
   */
  get resolved(): 'dark' | 'light' {
    if (this.#theme !== 'system') return this.#theme

    if (typeof window === 'undefined') return 'light'

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
}

export const setThemeContext = (state: ThemeState) => setContext(KEY, state)

/** The theme from the nearest `ThemeProvider`. */
export function useTheme(): ThemeState {
  const state = getContext<ThemeState | undefined>(KEY)

  if (!state) throw new Error('useTheme must be used within a <ThemeProvider>')

  return state
}
