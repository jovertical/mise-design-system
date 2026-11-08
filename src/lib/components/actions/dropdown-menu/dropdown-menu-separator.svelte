<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuSeparator`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuSeparatorProps = DropdownMenuPrimitive.SeparatorProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DropdownMenuSeparatorProps = $props()
</script>

<DropdownMenuPrimitive.Separator
  bind:ref
  data-slot="dropdown-menu-separator"
  class={cn('bg-border -mx-1 my-1 h-px', className)}
  {...rest}
/>
