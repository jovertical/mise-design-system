<!--
  Origin: the React package 2.23.0 `table.tsx` (`Table`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: `compact` reaches the heads and cells through Svelte context, as React's does through React context.
-->
<script lang="ts" module>
  import type { HTMLTableAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type TableProps = WithElementRef<HTMLTableAttributes> & {
    /**
     * Tightens every row, the head included. The default suits a listing, where
     * a row is a click target; `compact` is for a table being read (line items,
     * totals, a mapping preview), where the extra height pushes the summary off
     * the card.
     */
    compact?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { setTableDensity } from './context.js'

  let {
    ref = $bindable(null),
    compact = false,
    class: className,
    children,
    ...rest
  }: TableProps = $props()

  setTableDensity(() => compact)
</script>

<div data-slot="table-container" class="relative w-full overflow-x-auto">
  <table
    bind:this={ref}
    data-slot="table"
    data-density={compact ? 'compact' : 'default'}
    class={cn('w-full caption-bottom text-sm', className)}
    {...rest}
  >
    {@render children?.()}
  </table>
</div>
