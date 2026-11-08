<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogMedia`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type AlertDialogMediaProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: AlertDialogMediaProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert-dialog-media"
  class={cn(
    "bg-muted mb-2 inline-flex size-16 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
