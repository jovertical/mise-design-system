<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuItem`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: bits-ui marks the active row `data-highlighted` rather than focusing
    it, so each `focus:` utility is mirrored on `data-[highlighted]`.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuItemProps = DropdownMenuPrimitive.ItemProps & {
    inset?: boolean
    /** `destructive` for an action that removes or ends something. */
    variant?: 'default' | 'destructive'
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    inset,
    variant = 'default',
    class: className,
    ...rest
  }: DropdownMenuItemProps = $props()
</script>

<DropdownMenuPrimitive.Item
  bind:ref
  data-slot="dropdown-menu-item"
  data-inset={inset || undefined}
  data-variant={variant}
  class={cn(
    "focus:bg-muted data-[highlighted]:bg-muted focus:text-foreground data-[highlighted]:text-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:data-[highlighted]:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 dark:data-[variant=destructive]:data-[highlighted]:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:data-[highlighted]:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center min-h-7 gap-2 rounded-xl in-data-[slot=dialog-content]:rounded-2xl px-2 py-1.5 text-sm whitespace-nowrap outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...rest}
/>
