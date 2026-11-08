<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenu`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: bits-ui DropdownMenu for Radix, with `bind:open`.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuProps = DropdownMenuPrimitive.RootProps
</script>

<script lang="ts">
  let { open = $bindable(false), ...rest }: DropdownMenuProps = $props()
</script>

<DropdownMenuPrimitive.Root bind:open {...rest} />
