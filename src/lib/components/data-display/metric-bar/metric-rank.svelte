<!--
  Origin: the React package 2.23.0 `metric-bar.tsx` (`MetricRank`)
  Diverged: takes `class` and spreads the rest onto the root, as every
    component does. The disc is the neutral wash, `bg-foreground/[0.07]`, not
    `bg-muted`, which vanished on the muted canvas.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * A place in a ranking, `1`, `2`, `3`, in a small muted circle. Smaller than
   * an `IconChip` on purpose: the number orders the rows, it is not what they
   * are about.
   */
  export type MetricRankProps = HTMLAttributes<HTMLSpanElement> & { rank: number }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { rank, class: className, ...rest }: MetricRankProps = $props()
</script>

<span
  data-slot="metric-rank"
  class={cn(
    'bg-foreground/[0.07] text-muted-foreground grid size-6 shrink-0 place-items-center rounded-full text-xs tabular-nums',
    className,
  )}
  {...rest}
>
  {rank}
</span>
