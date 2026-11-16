<!--
  Independent totals side by side inside a card: a label and a figure per
  cell, nothing measuring a share of a whole.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardGrid,
    CardGridCell,
    CardHeader,
    CardTitle,
  } from '@jovertical/mise-design-system'

  const ZONES = [
    { name: 'Ambient', units: 212 },
    { name: 'Chilled', units: 41 },
    { name: 'Frozen', units: 59 },
    { name: 'Dry storage', units: 340 },
  ]
</script>

<Card class="w-full max-w-2xl">
  <CardHeader><CardTitle>Storage zones</CardTitle></CardHeader>
  <CardContent>
    <CardGrid columns={2}>
      {#each ZONES as zone (zone.name)}
        <CardGridCell>
          <p class="text-muted-foreground text-sm">{zone.name}</p>
          <p class="text-lg font-medium">{zone.units} units</p>
        </CardGridCell>
      {/each}
    </CardGrid>
  </CardContent>
</Card>
