<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBell from '@tabler/icons-svelte-runes/icons/bell'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconFileText from '@tabler/icons-svelte-runes/icons/file-text'
  import IconLayoutSidebar from '@tabler/icons-svelte-runes/icons/layout-sidebar'
  import IconSettings from '@tabler/icons-svelte-runes/icons/settings'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'

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
  import CommandTrigger from './command-trigger.svelte'

  const { Story } = defineMeta({
    title: 'Actions/Command',
    component: Command,
    tags: ['shadcn'],
  })

  const palette = $state({ open: false })
  const search = $state({ open: false })
  const header = $state({ open: false })
</script>

{#snippet commands()}
  <CommandInput placeholder="Search for a command…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Navigate">
      <CommandItem><IconShoppingCart />Orders<CommandShortcut>⌘O</CommandShortcut></CommandItem>
      <CommandItem><IconBuildingWarehouse />Locations</CommandItem>
      <CommandItem><IconUser />Customers</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem><IconFileText />New adjustment</CommandItem>
      <CommandItem disabled><IconSettings />Settings</CommandItem>
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
  `CommandTrigger` as it rests: the default label with the shortcut, a label of
  its own, and `hotkey={false}`, which registers no key and drops the hint.
  Filled like an input, so it reads as a field before it is hovered.
-->
<Story name="States" asChild>
  <div class="flex max-w-xs flex-col gap-3">
    <CommandTrigger hotkey="j" />
    <CommandTrigger hotkey={false}>Search orders…</CommandTrigger>
    <CommandTrigger hotkey={false} />
  </div>
</Story>

<!--
  The trigger and the palette share one `open`: a click opens it, and ⌘K or
  Ctrl K toggles it from anywhere on the page.
-->
<Story name="With trigger" asChild>
  <CommandTrigger bind:open={search.open} class="max-w-xs" />
  <CommandDialog bind:open={search.open}>{@render commands()}</CommandDialog>
</Story>

<!--
  `CommandDialog` puts the same list in a dialog for a palette that takes over
  the screen. Its title is for a screen reader only.
-->
<Story name="In a dialog" asChild>
  <Button variant="outline" onclick={() => (palette.open = true)}>Open command palette</Button>
  <CommandDialog bind:open={palette.open}>{@render commands()}</CommandDialog>
</Story>

<!--
  An app header, as the portals draw one: a card bar holding the sidebar
  toggle, the search field and the header's icon buttons. The field takes the
  free width up to `md:w-72`.
-->
<Story name="In a header" asChild>
  <div class="bg-card flex h-12 w-full max-w-3xl items-center gap-2 rounded-xl border px-2">
    <Button variant="ghost" size="sm" iconOnly aria-label="Toggle sidebar">
      <IconLayoutSidebar />
    </Button>
    <CommandTrigger bind:open={header.open} hotkey={false} class="ml-auto w-48 shrink md:w-72" />
    <Button variant="ghost" size="sm" iconOnly aria-label="Notifications"><IconBell /></Button>
  </div>
  <CommandDialog bind:open={header.open}>{@render commands()}</CommandDialog>
</Story>
