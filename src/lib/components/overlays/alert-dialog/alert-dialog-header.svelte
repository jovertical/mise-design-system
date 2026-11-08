<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogHeader`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type AlertDialogHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: AlertDialogHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert-dialog-header"
  class={cn(
    'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
