<!--
  CommandTrigger and CommandDialog share one `open`: a click opens the
  palette, which takes over the screen. In an app the trigger registers ⌘K;
  `hotkey={false}` here, since these docs' header already has it.
-->
<script lang="ts">
  import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandTrigger,
  } from '@jovertical/mise-design-system'

  let open = $state(false)
</script>

<CommandTrigger bind:open hotkey={false} class="max-w-xs">Search orders…</CommandTrigger>

<CommandDialog bind:open title="Search" description="Find an order or a location.">
  <CommandInput placeholder="Search orders, locations…" />
  <CommandList>
    <CommandEmpty>Nothing matches.</CommandEmpty>
    <CommandGroup heading="Orders">
      <CommandItem onSelect={() => (open = false)}>OR-2041 · Bloom & Stem</CommandItem>
      <CommandItem onSelect={() => (open = false)}>OR-2053 · Harbour Grocers</CommandItem>
    </CommandGroup>
    <CommandGroup heading="Locations">
      <CommandItem onSelect={() => (open = false)}>Riverside</CommandItem>
      <CommandItem onSelect={() => (open = false)}>North yard</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
