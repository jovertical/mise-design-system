<!--
  Origin: the React package 2.23.0 `sonner.tsx`, itself shadcn/ui new-york `sonner`
  Svelte: shadcn-svelte `sonner`
  Diverged: svelte-sonner for sonner. With no `theme` prop the toaster follows
    the `.dark` class on <html> (which `ThemeProvider` sets), the same class
    every other component answers to; `system` is resolved here rather than
    handed to svelte-sonner, as in React. The per-type class is `mise-toast`.
    Tabler's icons for Lucide's.
-->
<script lang="ts" module>
  import type { ToasterProps as SonnerProps } from 'svelte-sonner'

  export type ToasterProps = SonnerProps
</script>

<script lang="ts">
  import IconAlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle'
  import IconCircleCheck from '@tabler/icons-svelte-runes/icons/circle-check'
  import IconCircleX from '@tabler/icons-svelte-runes/icons/circle-x'
  import IconInfoCircle from '@tabler/icons-svelte-runes/icons/info-circle'
  import IconLoader2 from '@tabler/icons-svelte-runes/icons/loader-2'
  import { Toaster as Sonner } from 'svelte-sonner'

  let { theme, toastOptions, ...rest }: ToasterProps = $props()

  let pageIsDark = $state(false)

  /*
   * Follow the page rather than the OS. A toaster left on `system` picks its
   * theme from prefers-color-scheme while the page follows the `.dark` class,
   * and with a dark OS and a light app that put light text on a white toast.
   */
  $effect(() => {
    const root = document.documentElement

    const read = () => {
      pageIsDark = root.classList.contains('dark')
    }

    read()

    const observer = new MutationObserver(read)

    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  })

  function systemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const resolvedTheme = $derived.by((): 'light' | 'dark' => {
    if (theme === 'light' || theme === 'dark') return theme

    if (theme === 'system') return systemTheme()

    return pageIsDark ? 'dark' : 'light'
  })
</script>

{#snippet successIcon()}
  <IconCircleCheck class="size-4" />
{/snippet}
{#snippet infoIcon()}
  <IconInfoCircle class="size-4" />
{/snippet}
{#snippet warningIcon()}
  <IconAlertTriangle class="size-4" />
{/snippet}
{#snippet errorIcon()}
  <IconCircleX class="size-4" />
{/snippet}
{#snippet loadingIcon()}
  <IconLoader2 class="size-4 animate-spin" />
{/snippet}

<Sonner
  theme={resolvedTheme}
  class="toaster group"
  style="--normal-bg: var(--popover); --normal-text: var(--popover-foreground); --normal-border: var(--border); --border-radius: var(--radius);"
  {successIcon}
  {infoIcon}
  {warningIcon}
  {errorIcon}
  {loadingIcon}
  {...rest}
  toastOptions={{
    ...toastOptions,
    // The hook the per-type colours in components.css hang off. Merged rather
    // than replaced, so a caller's own toastOptions extend it.
    classes: { toast: 'mise-toast', ...toastOptions?.classes },
  }}
/>
