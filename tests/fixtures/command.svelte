<script lang="ts">
  import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from '../../src/lib/index.js'

  let { dialog = false }: { dialog?: boolean } = $props()
</script>

{#snippet list()}
  <CommandInput placeholder="Search for a command…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Navigate">
      <CommandItem>Orders<CommandShortcut>⌘O</CommandShortcut></CommandItem>
      <CommandItem>Locations</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Actions">
      <CommandItem disabled>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
{/snippet}

{#if dialog}
  <CommandDialog open>{@render list()}</CommandDialog>
{:else}
  <Command>{@render list()}</Command>
{/if}
