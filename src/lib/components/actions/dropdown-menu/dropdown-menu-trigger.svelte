<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuTrigger`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuTriggerProps = DropdownMenuPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: DropdownMenuTriggerProps = $props()
</script>

<DropdownMenuPrimitive.Trigger bind:ref data-slot="dropdown-menu-trigger" {...rest} />
