<script module lang="ts">
  import FileTextIcon from '@lucide/svelte/icons/file-text'
  import SettingsIcon from '@lucide/svelte/icons/settings'
  import CartIcon from '@lucide/svelte/icons/shopping-cart'
  import UserIcon from '@lucide/svelte/icons/user'
  import WarehouseIcon from '@lucide/svelte/icons/warehouse'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../button/button.svelte'
  import Command from './command.svelte'
  import CommandDialog from './command-dialog.svelte'
  import CommandEmpty from './command-empty.svelte'
  import CommandGroup from './command-group.svelte'
  import CommandInput from './command-input.svelte'
  import CommandItem from './command-item.svelte'
  import CommandList from './command-list.svelte'
  import CommandSeparator from './command-separator.svelte'
  import CommandShortcut from './command-shortcut.svelte'

  const { Story } = defineMeta({
    title: 'Actions/Command',
    component: Command,
    tags: ['shadcn'],
  })

  const palette = $state({ open: false })
</script>

{#snippet commands()}
  <CommandInput placeholder="Search for a command…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Navigate">
      <CommandItem><CartIcon />Orders<CommandShortcut>⌘O</CommandShortcut></CommandItem>
      <CommandItem><WarehouseIcon />Locations</CommandItem>
      <CommandItem><UserIcon />Customers</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem><FileTextIcon />New adjustment</CommandItem>
      <CommandItem disabled><SettingsIcon />Settings</CommandItem>
    </CommandGroup>
  </CommandList>
{/snippet}

<!--
  A filterable, keyboard-navigable list, grouped by section: the shape a
  command palette is built on. Bare, it is an inline picker with no overlay.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Command class="max-w-sm rounded-2xl border shadow-sm" {...args}>{@render commands()}</Command>
  {/snippet}
</Story>

<!--
  `CommandDialog` puts the same list in a dialog for a palette that takes over
  the screen. Its title is for a screen reader only.
-->
<Story name="In a dialog" asChild>
  <Button variant="outline" onclick={() => (palette.open = true)}>Open command palette</Button>
  <CommandDialog bind:open={palette.open}>{@render commands()}</CommandDialog>
</Story>
