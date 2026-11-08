<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuShortcut`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type DropdownMenuShortcutProps = WithElementRef<HTMLAttributes<HTMLSpanElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: DropdownMenuShortcutProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="dropdown-menu-shortcut"
  class={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
  {...rest}
>
  {@render children?.()}
</span>
