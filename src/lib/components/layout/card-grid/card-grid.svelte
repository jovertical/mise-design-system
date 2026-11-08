<!--
  Origin: the React package 2.23.0 `card-grid.tsx`
  Diverged: the cells are `CardGridCell` children rather than an `items` array
    of `{ id, content }`, since a Svelte snippet does not sit naturally in an
    array. The classes are React's.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A responsive grid of bordered cells, with no opinion on what fills them.
   * `MetricGrid` is this with a `MetricBar` in every cell; a caller whose cells
   * are not a percent breakdown wants the grid on its own.
   */
  export type CardGridProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /**
     * Columns at `md` and up. Below that it is always one: two cells side by
     * side on a phone leave no room for real content.
     */
    columns?: 2 | 3 | 4
  }

  const COLUMN_CLASSES: Record<NonNullable<CardGridProps['columns']>, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    columns = 3,
    class: className,
    children,
    ...rest
  }: CardGridProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-grid"
  class={cn('grid gap-4', COLUMN_CLASSES[columns], className)}
  {...rest}
>
  {@render children?.()}
</div>
