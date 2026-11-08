<!--
  Origin: the React package 2.23.0 `timeline.tsx` (`TimelineContent`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** The body. `pb-5` is the gap between entries; it sits here rather than on the item so the connector, which shares the row, runs the full distance. */
  export type TimelineContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: TimelineContentProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="timeline-content"
  class={cn(
    'text-muted-foreground col-start-3 col-end-4 row-start-2 row-end-2 mr-auto space-y-1 pb-5 pl-3 text-xs',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
