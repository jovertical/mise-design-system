<!--
  Origin: the React package 2.23.0 `table.tsx` (`TableCaption`), itself shadcn/ui new-york `table`
  Svelte: shadcn-svelte `table`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** A caption under the table. */
  export type TableCaptionProps = WithElementRef<HTMLAttributes<HTMLElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: TableCaptionProps = $props()
</script>

<caption
  bind:this={ref}
  data-slot="table-caption"
  class={cn('text-muted-foreground mt-4 text-sm', className)}
  {...rest}
>
  {@render children?.()}
</caption>
