<!--
  Items, a label, checkboxes, radios and a submenu, sharing one row
  treatment, so a row of plain text is as tall as one carrying a control.
-->
<script lang="ts">
  import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from '@jovertical/mise-design-system'
  import IconDots from '@tabler/icons-svelte-runes/icons/dots'

  let showArchived = $state(true)
  let showDrafts = $state(false)
  let sort = $state('recent')
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet child({ props })}
      <Button variant="ghost" iconOnly aria-label="View options" {...props}><IconDots /></Button>
    {/snippet}
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" class="w-56">
    <DropdownMenuLabel>View</DropdownMenuLabel>
    <DropdownMenuGroup>
      <DropdownMenuCheckboxItem bind:checked={showArchived}>Show archived</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={showDrafts}>Show drafts</DropdownMenuCheckboxItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
    <DropdownMenuRadioGroup bind:value={sort}>
      <DropdownMenuRadioItem value="recent">Most recent</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>CSV</DropdownMenuItem>
        <DropdownMenuItem>JSON</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
