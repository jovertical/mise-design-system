<!--
  Origin: the React package 2.23.0 `sonner.tsx`, itself shadcn/ui new-york `sonner`
  Svelte: shadcn-svelte `sonner`
  Diverged: svelte-sonner for sonner. mise has no theme provider, so with no
    `theme` prop the toaster follows the `.dark` class on <html>, the same class
    every other component answers to; `system` is resolved here rather than
    handed to svelte-sonner, as in React. The per-type class is `mise-toast`.
-->
<script lang="ts" module>
  import type { ToasterProps as SonnerProps } from 'svelte-sonner'

  export type ToasterProps = SonnerProps
</script>

<script lang="ts">
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
  import InfoIcon from '@lucide/svelte/icons/info'
  import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle'
  import OctagonXIcon from '@lucide/svelte/icons/octagon-x'
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert'
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
  <CircleCheckIcon class="size-4" />
{/snippet}
{#snippet infoIcon()}
  <InfoIcon class="size-4" />
{/snippet}
{#snippet warningIcon()}
  <TriangleAlertIcon class="size-4" />
{/snippet}
{#snippet errorIcon()}
  <OctagonXIcon class="size-4" />
{/snippet}
{#snippet loadingIcon()}
  <LoaderCircleIcon class="size-4 animate-spin" />
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
