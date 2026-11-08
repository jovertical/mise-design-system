<!--
  Origin: the React package 2.23.0 `empty.tsx` (`Empty`), itself shadcn/ui new-york `empty`
  Svelte: shadcn-svelte `empty`
  Diverged: none beyond the port. The React divergences from shadcn carry over.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A dashed panel for nothing-here-yet. `border` as well as `border-dashed`:
   * Tailwind's `border-dashed` sets only the style, so without a width the
   * panel drew no edge at all.
   */
  export type EmptyProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: EmptyProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="empty"
  class={cn(
    'flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center text-balance',
    'bg-muted/30',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
