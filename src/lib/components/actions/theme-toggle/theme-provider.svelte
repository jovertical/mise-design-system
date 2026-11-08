<!--
  Origin: the React package 2.23.0 `use-theme.tsx` (`ThemeProvider`), in its hooks folder
  Diverged: a Svelte context for React's (round 8 plan, R8-6). Same storage key
    default, `system` handling and class on `<html>`, so an app moving over keeps
    its users' stored choice.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { Theme } from './theme.svelte.js'

  /**
   * Applies a `light` / `dark` class to `<html>` and persists the choice. The
   * class on the root is what Tailwind's `dark:` variant reads, so this touches
   * the DOM directly rather than passing a value down alone.
   *
   * `system` re-reads `prefers-color-scheme` on every mount but does not
   * subscribe to it. Web only, as React's.
   */
  export type ThemeProviderProps = {
    defaultTheme?: Theme
    /** localStorage key. Distinct per app, so two apps on one host do not share a theme. */
    storageKey?: string
    children: Snippet
  }
</script>

<script lang="ts">
  import { setThemeContext, ThemeState } from './theme.svelte.js'

  let {
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
    children,
  }: ThemeProviderProps = $props()

  // The key and default are read once, at mount, as React's useState initialiser read them.
  // svelte-ignore state_referenced_locally
  const state = new ThemeState(storageKey, defaultTheme)
  setThemeContext(state)

  $effect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(state.resolved)
  })
</script>

{@render children()}
