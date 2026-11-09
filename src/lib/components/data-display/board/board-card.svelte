<!--
  Origin: mise
  Diverged: none. Part of Board, which mise authored (2026-11-09).
-->
<script lang="ts" module>
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * One item in a column, on a card surface. With `href` it is a link to the
   * item: its hover darkens the border rather than tinting the fill, because
   * `--accent` is the active nav row and nothing else.
   */
  export type BoardCardProps = WithElementRef<HTMLAnchorAttributes>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    href,
    class: className,
    children,
    ...rest
  }: BoardCardProps = $props()
</script>

<svelte:element
  this={href ? 'a' : 'div'}
  bind:this={ref}
  {href}
  data-slot="board-card"
  class={cn(
    'bg-card text-card-foreground flex flex-col gap-1 rounded-lg border p-3 text-sm shadow-xs',
    href &&
      'hover:border-foreground/20 focus-visible:ring-ring/50 outline-none transition-colors focus-visible:ring-[3px]',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</svelte:element>
