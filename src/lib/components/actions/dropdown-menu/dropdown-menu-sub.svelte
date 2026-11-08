<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuSub`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuSubProps = DropdownMenuPrimitive.SubProps
</script>

<script lang="ts">
  let { open = $bindable(false), ...rest }: DropdownMenuSubProps = $props()
</script>

<DropdownMenuPrimitive.Sub bind:open {...rest} />
