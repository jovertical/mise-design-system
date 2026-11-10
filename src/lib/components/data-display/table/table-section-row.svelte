<!--
  Origin: mise
  Diverged: none. The table family has no React original for it; mise
    authored it for bertos-bakery-ops' chart of accounts, grouped by account
    type (2026-11-10).
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A heading row inside `TableBody` that names the group of rows under it
   * (assets, income, expenses): one `th scope="colgroup"` across the table.
   *
   * It spans every column, counted from the table's first row once mounted, so
   * the caller never keeps a column count in step with the header. `colspan`
   * sets it instead.
   */
  export type TableSectionRowProps = WithElementRef<HTMLAttributes<HTMLTableRowElement>> & {
    colspan?: number
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { useTableCompact } from './context.js'

  let {
    ref = $bindable(null),
    colspan,
    class: className,
    children,
    ...rest
  }: TableSectionRowProps = $props()

  const compact = useTableCompact()

  let counted = $state(1)

  $effect(() => {
    const firstRow = ref?.closest('table')?.rows[0]

    if (!firstRow) return

    counted = [...firstRow.cells].reduce((sum, cell) => sum + cell.colSpan, 0)
  })
</script>

<tr
  bind:this={ref}
  data-slot="table-section-row"
  class={cn('bg-muted/50 border-b', className)}
  {...rest}
>
  <th
    scope="colgroup"
    colspan={colspan ?? counted}
    class={cn(
      'text-muted-foreground px-4 text-left align-middle text-xs font-semibold tracking-wide uppercase',
      compact() ? 'h-8' : 'h-9',
    )}
  >
    {@render children?.()}
  </th>
</tr>
