<script lang="ts">
  import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '../../src/lib/index.js'

  let {
    open = $bindable(false),
    archived = $bindable(false),
    chosen = $bindable(''),
  }: { open?: boolean; archived?: boolean; chosen?: string } = $props()
</script>

<DropdownMenu bind:open>
  <DropdownMenuTrigger>
    {#snippet child({ props })}
      <Button variant="outline" size="sm" {...props}>Actions</Button>
    {/snippet}
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => (chosen = 'edit')}>Edit</DropdownMenuItem>
    <DropdownMenuCheckboxItem bind:checked={archived}>Show archived</DropdownMenuCheckboxItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="critical" onSelect={() => (chosen = 'archive')}
      >Archive</DropdownMenuItem
    >
    <DropdownMenuItem variant="destructive" onSelect={() => (chosen = 'delete')}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
<output data-testid="state"
  >{open ? 'open' : 'closed'} {chosen} {archived ? 'archived' : ''}</output
>
