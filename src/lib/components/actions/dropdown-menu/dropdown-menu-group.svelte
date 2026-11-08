<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuGroup`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuGroupProps = DropdownMenuPrimitive.GroupProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: DropdownMenuGroupProps = $props()
</script>

<DropdownMenuPrimitive.Group bind:ref data-slot="dropdown-menu-group" {...rest} />
