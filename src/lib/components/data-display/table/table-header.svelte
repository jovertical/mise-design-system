<!--
  Origin: the React package 2.23.0 `table.tsx` (`TableHeader`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** The column labels, muted, ruled off from the body. */
  export type TableHeaderProps = WithElementRef<HTMLAttributes<HTMLTableSectionElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TableHeaderProps = $props()
</script>

<thead
  bind:this={ref}
  data-slot="table-header"
  class={cn('text-muted-foreground border-b bg-transparent [&_tr]:border-b-0', className)}
  {...rest}
>
  {@render children?.()}
</thead>
