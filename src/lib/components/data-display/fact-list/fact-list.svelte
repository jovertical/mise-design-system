<!--
  Origin: the React package 2.23.0 `fact-list.tsx`
  Diverged: holds `FactListItem`s, which absorb React's `FactRow` and
    `FactField` (round 4a, R4-1). The list itself is React's.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The `dl` a column of facts sits in. An item's `dt`/`dd` pair is only valid
   * inside a `dl`; left to callers, the wrapper was typed thirty times, drifted
   * into other gaps, and was left out altogether on five cards.
   *
   * A summary split into what a thing is and what it totals is two lists with a
   * `Separator` between them, not one list with a prop for the rule. A single
   * row, like a grand total, is a list of one.
   */
  export type FactListProps = WithElementRef<HTMLAttributes<HTMLDListElement>> & {
    /**
     * `gap-1` instead of `gap-2`, for an aside where the list is a footnote to a
     * preview above it rather than the card's content.
     */
    compact?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    compact = false,
    class: className,
    children,
    ...rest
  }: FactListProps = $props()
</script>

<dl
  bind:this={ref}
  data-slot="fact-list"
  class={cn('flex flex-col', compact ? 'gap-1' : 'gap-2', className)}
  {...rest}
>
  {@render children?.()}
</dl>
