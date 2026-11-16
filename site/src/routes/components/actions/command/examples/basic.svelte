<!--
  A filterable, keyboard-navigable list, grouped by section: the shape a
  command palette is built on. Bare, it is an inline picker with no overlay.
-->
<script lang="ts">
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconFileText from '@tabler/icons-svelte-runes/icons/file-text'
  import IconSettings from '@tabler/icons-svelte-runes/icons/settings'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
</script>

<Command class="max-w-sm rounded-2xl border shadow-sm">
  <CommandInput placeholder="Search for a command…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Navigate">
      <CommandItem><IconShoppingCart />Orders<CommandShortcut>⌘O</CommandShortcut></CommandItem>
      <CommandItem><IconBuildingWarehouse />Locations</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem><IconFileText />New stock adjustment</CommandItem>
      <CommandItem disabled><IconSettings />Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
