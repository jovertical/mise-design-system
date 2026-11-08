<!--
  Origin: the React package 2.23.0 `table.tsx` (`TableRow`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** One row. `data-state="selected"` tints it as the active nav row is tinted. */
  export type TableRowProps = WithElementRef<HTMLAttributes<HTMLTableRowElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TableRowProps = $props()
</script>

<tr
  bind:this={ref}
  data-slot="table-row"
  class={cn(
    'border-border hover:bg-muted/40 data-[state=selected]:bg-accent border-b transition-colors',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</tr>
