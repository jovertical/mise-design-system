<!--
  Origin: the React package 2.23.0 `card-grid.tsx`
  Diverged: React draws the cell inline in `CardGrid`'s map; here it is a part,
    so a caller writes the cells as children.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * One cell. Bordered rather than filled or shadowed, deliberately lighter than
   * `Card`: a wash or a ring on every cell of a dense grid competes with what
   * the content needs to carry attention.
   */
  export type CardGridCellProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: CardGridCellProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-grid-cell"
  class={cn('rounded-lg border p-4', className)}
  {...rest}
>
  {@render children?.()}
</div>
