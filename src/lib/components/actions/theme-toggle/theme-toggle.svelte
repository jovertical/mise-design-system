<!--
  Origin: the React package 2.23.0 `theme-toggle.tsx`
  Diverged: Lucide's sun and moon for Tabler's. Spreads the rest onto the
    button, as every component does.
-->
<script lang="ts" module>
  import type { ButtonProps } from '../button/button.svelte'

  /**
   * Icon-only toggle between light and dark, inside a `ThemeProvider`.
   *
   * `system` only ever arrives as the app's initial value; this never sets it
   * back. So a first click from `system` cannot be a silent no-op: the
   * resolved theme decides which concrete value to flip to, and the icon and
   * the click always agree on what "currently active" means.
   */
  export type ThemeToggleProps = Omit<ButtonProps, 'children' | 'onclick'>
</script>

<script lang="ts">
  import MoonIcon from '@lucide/svelte/icons/moon'
  import SunIcon from '@lucide/svelte/icons/sun'

  import { cn } from '../../../utils/cn.js'
  import Button from '../button/button.svelte'
  import { useTheme } from './theme.svelte.js'

  let { class: className, ...rest }: ThemeToggleProps = $props()

  const theme = useTheme()
  const dark = $derived(theme.resolved === 'dark')
</script>

<Button
  variant="ghost"
  size="sm"
  iconOnly
  class={cn('rounded-full', className)}
  onclick={() => theme.setTheme(dark ? 'light' : 'dark')}
  aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
  {...rest}
>
  {#if dark}
    <SunIcon class="size-4" />
  {:else}
    <MoonIcon class="size-4" />
  {/if}
</Button>
