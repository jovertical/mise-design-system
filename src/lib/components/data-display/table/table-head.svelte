<!--
  Origin: the React package 2.23.0 `table.tsx` (`TableHead`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLThAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type TableHeadProps = WithElementRef<HTMLThAttributes> & {
    /** Right-aligns the column. Pair it with `numeric` on the column's cells. */
    numeric?: boolean
    /**
     * For a header that names the things compared rather than labelling a
     * column of values (the roles across a permission matrix): ink at body
     * size instead of the muted caption.
     */
    strong?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { useTableCompact } from './context.js'

  let {
    ref = $bindable(null),
    numeric = false,
    strong = false,
    class: className,
    children,
    ...rest
  }: TableHeadProps = $props()

  const compact = useTableCompact()
</script>

<th
  bind:this={ref}
  data-slot="table-head"
  data-numeric={numeric || undefined}
  data-strong={strong || undefined}
  class={cn(
    'text-muted-foreground px-4 text-left align-middle text-xs font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
    compact() ? 'h-9' : 'h-11',
    numeric && 'text-right',
    strong && 'text-foreground text-sm font-semibold',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</th>
