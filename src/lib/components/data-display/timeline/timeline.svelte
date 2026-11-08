<!--
  Origin: the React package 2.23.0 `timeline.tsx` (`Timeline`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLOlAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A list of events, newest first by convention, each a badge, a title and a
   * body joined by a vertical rule.
   *
   * A two-column grid rather than a flex row with an absolutely positioned
   * rule. Column two holds the badge in row one and the connector in row two;
   * column three holds the title in row one and the body in row two. The
   * connector is `h-full` inside its own cell, so it stretches to whatever the
   * body needs without anyone measuring anything. `items-center` on the row
   * puts the badge on the title's centre line, which is why the title is its
   * own grid child.
   */
  export type TimelineProps = WithElementRef<HTMLOlAttributes, HTMLOListElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TimelineProps = $props()
</script>

<ol
  bind:this={ref}
  data-slot="timeline"
  class={cn('grid [&>li]:grid-cols-[0_min-content_1fr]', className)}
  {...rest}
>
  {@render children?.()}
</ol>
