/**
 * Origin: the React package 2.23.0 `use-theme.tsx` (`ThemeProviderState`, `useTheme`), in its hooks folder
 * Diverged: a rune-backed state shared through Svelte's context, for React's
 *   context and hook (round 8 plan, R8-6). It reads `localStorage` only in a
 *   browser, so a server render gets the default rather than a crash.
 */
import { getContext, setContext } from 'svelte'

export type Theme = 'dark' | 'light' | 'system'

const KEY = Symbol('mise-theme')

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
   * more surprising than one that settles at load.
   */
  get resolved(): 'dark' | 'light' {
    if (this.#theme !== 'system') return this.#theme
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
