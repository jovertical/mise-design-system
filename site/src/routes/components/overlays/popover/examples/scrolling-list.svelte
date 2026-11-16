<!--
  A list panel owns its padding (`p-0`), so its rows run to the edges. Rules
  fence a middle that scrolls under a fixed header and footer; a list that
  fits needs only space.
-->
<script lang="ts">
  import { Button, Popover, PopoverContent, PopoverTrigger } from '@jovertical/mise-design-system'

  const NOTIFICATIONS = [
    'OR-2041 is ready',
    'Van 12 left Harbour Hub',
    'Riverside is low on crates',
    'OR-2053 was cancelled',
    'Stock count saved at North yard',
    'Truck 212 is due for service',
  ]
</script>

<Popover>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button variant="outline" {...props}>Notifications</Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent class="w-80 p-0">
    <div class="flex items-center justify-between border-b px-4 py-3">
      <p class="text-sm font-semibold">Notifications</p>
      <Button variant="ghost" size="sm" class="h-auto px-2 py-1 text-xs">Mark all read</Button>
    </div>
    <div class="max-h-48 overflow-y-auto">
      {#each NOTIFICATIONS as title (title)}
        <div class="px-4 py-3">
          <p class="text-sm font-medium">{title}</p>
          <p class="text-muted-foreground text-xs">a few minutes ago</p>
        </div>
      {/each}
    </div>
    <div class="border-t p-2">
      <Button variant="ghost" size="sm" class="w-full text-xs">Show all</Button>
    </div>
  </PopoverContent>
</Popover>
