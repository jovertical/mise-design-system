<!--
  Origin: the React package 2.23.0 `timeline.tsx` (`TimelineTitle`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** The row's heading. A `div`, not a `p`: the slot takes any children, a `Skeleton` among them, and a block inside a paragraph is invalid HTML. */
  export type TimelineTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TimelineTitleProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="timeline-title"
  class={cn(
    'text-foreground col-start-3 col-end-4 row-start-1 row-end-1 mr-auto pl-3 text-sm font-semibold',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
