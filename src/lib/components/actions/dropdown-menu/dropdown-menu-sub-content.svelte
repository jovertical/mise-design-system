<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuSubContent`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: the origin variable is bits-ui's.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuSubContentProps = DropdownMenuPrimitive.SubContentProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DropdownMenuSubContentProps = $props()
</script>

<DropdownMenuPrimitive.SubContent
  bind:ref
  data-slot="dropdown-menu-sub-content"
  class={cn(
    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--bits-menu-content-transform-origin) overflow-hidden rounded-2xl p-1.5 shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10',
    className,
  )}
  {...rest}
/>
