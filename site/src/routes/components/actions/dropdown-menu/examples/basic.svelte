<!--
  A menu of commands: role="menu" with menuitems, focus moved by the arrow
  keys, closed when something is chosen. Rows that are not commands belong in
  a Popover, not a menu.
-->
<script lang="ts">
  import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from '@jovertical/mise-design-system'
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet child({ props })}
      <Button variant="outline" size="sm" {...props}>Actions</Button>
    {/snippet}
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>
      Edit order
      <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="critical">Cancel order</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
