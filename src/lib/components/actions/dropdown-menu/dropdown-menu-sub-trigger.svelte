<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuSubTrigger`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: bits-ui marks the active row `data-highlighted` rather than focusing
    it, so each `focus:` utility is mirrored on `data-[highlighted]`.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuSubTriggerProps = DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean
  }
</script>

<script lang="ts">
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    inset,
    class: className,
    children,
    ...rest
  }: DropdownMenuSubTriggerProps = $props()
</script>

<DropdownMenuPrimitive.SubTrigger
  bind:ref
  data-slot="dropdown-menu-sub-trigger"
  data-inset={inset || undefined}
  class={cn(
    "focus:bg-muted data-[highlighted]:bg-muted focus:text-foreground data-[highlighted]:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center min-h-7 gap-2 rounded-xl in-data-[slot=dialog-content]:rounded-2xl px-2 py-1.5 text-sm whitespace-nowrap outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...rest}
>
  {@render children?.()}
  <ChevronRightIcon class="ml-auto size-4" />
</DropdownMenuPrimitive.SubTrigger>
