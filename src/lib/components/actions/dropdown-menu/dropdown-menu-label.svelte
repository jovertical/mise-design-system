<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuLabel`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: a plain div, as in shadcn-svelte: bits-ui's GroupHeading must sit
    inside a Group, and React's Label did not.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type DropdownMenuLabelProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    inset?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    inset,
    class: className,
    children,
    ...rest
  }: DropdownMenuLabelProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="dropdown-menu-label"
  data-inset={inset || undefined}
  class={cn('text-muted-foreground px-2 py-1 text-xs font-medium data-[inset]:pl-8', className)}
  {...rest}
>
  {@render children?.()}
</div>
