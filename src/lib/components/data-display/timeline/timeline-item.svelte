<!--
  Origin: the React package 2.23.0 `timeline.tsx` (`TimelineItem`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLLiAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type TimelineItemProps = WithElementRef<HTMLLiAttributes, HTMLLIElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TimelineItemProps = $props()
</script>

<li
  bind:this={ref}
  data-slot="timeline-item"
  class={cn('grid items-center gap-x-0', className)}
  {...rest}
>
  {@render children?.()}
</li>
