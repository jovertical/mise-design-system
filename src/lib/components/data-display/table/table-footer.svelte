<!--
  Origin: the React package 2.23.0 `table.tsx` (`TableFooter`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** Totals, on a muted band under the body. */
  export type TableFooterProps = WithElementRef<HTMLAttributes<HTMLTableSectionElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TableFooterProps = $props()
</script>

<tfoot
  bind:this={ref}
  data-slot="table-footer"
  class={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
  {...rest}
>
  {@render children?.()}
</tfoot>
