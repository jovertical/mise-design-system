<!--
  Origin: the React package 2.23.0 `table.tsx` (`TableCell`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLTdAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type TableCellProps = WithElementRef<HTMLTdAttributes> & {
    /** Right-aligned with tabular figures, so a column of numbers lines up. */
    numeric?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { useTableCompact } from './context.js'

  let {
    ref = $bindable(null),
    numeric = false,
    class: className,
    children,
    ...rest
  }: TableCellProps = $props()

  const compact = useTableCompact()
</script>

<td
  bind:this={ref}
  data-slot="table-cell"
  data-numeric={numeric || undefined}
  class={cn(
    'px-4 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    compact() ? 'py-2.5' : 'py-3.5',
    numeric && 'text-right tabular-nums',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</td>
