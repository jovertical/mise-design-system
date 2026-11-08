<!--
  Origin: the React package 2.23.0 `table.tsx` (`TableBody`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** The rows. The last row drops its rule; the table edge is enough. */
  export type TableBodyProps = WithElementRef<HTMLAttributes<HTMLTableSectionElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TableBodyProps = $props()
</script>

<tbody
  bind:this={ref}
  data-slot="table-body"
  class={cn('bg-card [&_tr:last-child]:border-0', className)}
  {...rest}
>
  {@render children?.()}
</tbody>
