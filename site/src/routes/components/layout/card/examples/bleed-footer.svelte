<!--
  A footer that is one wide target to the card's edges: `bleed` cancels the
  bottom padding, drops the side padding and rounds the corners together. For
  "see the rest of this", not for Save and Cancel.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@jovertical/mise-design-system'
  import IconArrowUpRight from '@tabler/icons-svelte-runes/icons/arrow-up-right'

  const ITEMS = ['All-purpose flour', 'Arborio rice', 'Baguette']
</script>

<Card class="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Stock items</CardTitle>
    <CardDescription>20 items</CardDescription>
  </CardHeader>
  <CardContent>
    <ul class="flex flex-col gap-1">
      {#each ITEMS as item (item)}
        <li class="bg-card flex items-center gap-2 rounded-xl border px-2 py-1.5 text-sm">
          <span class="min-w-0 flex-1 truncate">{item}</span>
          <span class="text-muted-foreground shrink-0 text-xs">kg</span>
        </li>
      {/each}
    </ul>
  </CardContent>
  <CardFooter bleed divided>
    <Button variant="ghost" class="h-12 w-full justify-between rounded-none">
      View all stock items
      <IconArrowUpRight class="size-4" />
    </Button>
  </CardFooter>
</Card>
