<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuPortal`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuPortalProps = DropdownMenuPrimitive.PortalProps
</script>

<script lang="ts">
  let { ...rest }: DropdownMenuPortalProps = $props()
</script>

<DropdownMenuPrimitive.Portal {...rest} />
