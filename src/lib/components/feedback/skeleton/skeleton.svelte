<!--
  Origin: the React package 2.23.0 `skeleton.tsx`, itself shadcn/ui new-york `skeleton`
  Svelte: shadcn-svelte `skeleton`
  Diverged: `bg-foreground/10` rather than `bg-accent`. shadcn's `--accent` is
    a neutral grey; the React package redefined it as the brand tint for the
    active nav row, so its skeletons pulsed in the brand colour. A foreground
    wash reads as neutral on the page and on a card, in both schemes. The rest
    is unaudited, as in the React package.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * Shaped to what it stands in for: there is no default size. Reach for it
   * where a component has not already drawn its own loading shape.
   */
  export type SkeletonProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: SkeletonProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="skeleton"
  class={cn('bg-foreground/10 animate-pulse rounded-md', className)}
  {...rest}
></div>
