<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuContent`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: the size and origin variables are bits-ui's (`--bits-menu-*`).
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  /** `min-w-44` (176px) by default, the width menus kept asking for. */
  export type DropdownMenuContentProps = DropdownMenuPrimitive.ContentProps & {
    portalProps?: DropdownMenuPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    sideOffset = 4,
    portalProps,
    class: className,
    ...rest
  }: DropdownMenuContentProps = $props()
</script>

<DropdownMenuPrimitive.Portal {...portalProps}>
  <DropdownMenuPrimitive.Content
    bind:ref
    data-slot="dropdown-menu-content"
    {sideOffset}
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--bits-menu-content-available-height) min-w-44 origin-(--bits-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl p-1.5 shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10',
      className,
    )}
    {...rest}
  />
</DropdownMenuPrimitive.Portal>
