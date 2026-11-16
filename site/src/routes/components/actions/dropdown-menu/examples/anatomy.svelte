<!--
  Open on the page, for the anatomy: no portal, so the menu renders in the
  stage under its trigger, and none of its hold on the page (focus taken,
  scroll lock, closing on Escape or an outside click).
-->
<script lang="ts">
  import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from '@jovertical/mise-design-system'
</script>

<div class="h-72">
  <DropdownMenu open>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="outline" size="sm" {...props}>Actions</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      class="w-56"
      portalProps={{ disabled: true }}
      onOpenAutoFocus={(event) => event.preventDefault()}
      preventScroll={false}
      trapFocus={false}
      interactOutsideBehavior="ignore"
      escapeKeydownBehavior="ignore"
    >
      <DropdownMenuLabel>Order OR-2041</DropdownMenuLabel>
      <DropdownMenuItem>
        Edit order
        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuCheckboxItem checked>Priority</DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem tone="critical">Cancel order</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
