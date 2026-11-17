<!-- Inside a card, `flush` lets the card's own padding do the work. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Item,
    ItemActions,
    ItemContent,
    ItemGroup,
    ItemTitle,
  } from '@jovertical/mise-design-system'

  const ACTIVITY = ['Register paired', 'Sync completed', 'Location created']
</script>

<Card class="w-full max-w-lg">
  <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
  <CardContent>
    <ItemGroup>
      {#each ACTIVITY as title (title)}
        <Item size="flush">
          <ItemContent><ItemTitle>{title}</ItemTitle></ItemContent>
          <ItemActions><span class="text-muted-foreground text-xs">2m ago</span></ItemActions>
        </Item>
      {/each}
    </ItemGroup>
  </CardContent>
</Card>
