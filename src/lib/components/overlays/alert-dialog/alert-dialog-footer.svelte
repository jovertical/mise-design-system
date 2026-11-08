<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogFooter`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type AlertDialogFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: AlertDialogFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert-dialog-footer"
  class={cn(
    'flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
