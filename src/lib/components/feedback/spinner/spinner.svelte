<!--
  Origin: the React package 2.23.0 `spinner.tsx`, itself shadcn/ui new-york `spinner`
  Svelte: shadcn-svelte `spinner`
  Diverged: takes an optional caption as children, absorbing React's `LoadingStatus`
    (`loading-status.tsx`). Captioned, it renders a `<span>` rather than LoadingStatus's
    `<p>`, so it can sit inside a button or a line of text. Otherwise unaudited, as in
    the React package.
-->
<script lang="ts" module>
  import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle'
  import type { ComponentProps, Snippet } from 'svelte'

  /**
   * `role="status"` and an `aria-label`, unlike a hand-spun icon: reach for this
   * rather than a spinning loader glyph, which is silent to a screen reader.
   *
   * Give it a caption to say what is being waited on; "Loading…" alone says
   * nothing the spinner does not. Captioned, the status announces the caption
   * and the icon is hidden from assistive technology.
   */
  export type SpinnerProps = ComponentProps<typeof LoaderCircleIcon> & {
    /** A short sentence naming what is being waited on. */
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { class: className, children, ...rest }: SpinnerProps = $props()
</script>

{#if children}
  <span
    role="status"
    data-slot="spinner"
    class="text-muted-foreground inline-flex items-center gap-2 text-sm"
  >
    <LoaderCircleIcon aria-hidden="true" class={cn('size-4 animate-spin', className)} {...rest} />
    <span>{@render children()}</span>
  </span>
{:else}
  <LoaderCircleIcon
    role="status"
    aria-label="Loading"
    data-slot="spinner"
    class={cn('size-4 animate-spin', className)}
    {...rest}
  />
{/if}
