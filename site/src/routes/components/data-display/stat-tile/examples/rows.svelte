<!--
  `rows` qualify the figure, and the tile rules them off. `surface="inset"` is
  the same tile inside a card, the summary over the evidence. A row's tone is
  for a directional pair, stock in against out.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    DeltaBadge,
    StatTile,
  } from '@jovertical/mise-design-system'
</script>

<div class="grid gap-4 sm:grid-cols-2">
  <StatTile
    label="Average turnover"
    value="5.8x"
    size="lg"
    description="Stock is moving faster than last period."
    rows={[
      { id: 'best', label: 'Best category', value: '8.4x' },
      { id: 'slowest', label: 'Slowest category', value: '2.3x' },
    ]}
  >
    {#snippet delta()}
      <DeltaBadge value={0.7} unit="x" />
    {/snippet}
  </StatTile>
  <Card>
    <CardHeader><CardTitle>Stock movement</CardTitle></CardHeader>
    <CardContent>
      <StatTile
        surface="inset"
        label="Net change"
        value="+823"
        tone="success"
        description="106 movements recorded."
        rows={[
          { id: 'in', label: 'Stock in', value: '+910', tone: 'success' },
          { id: 'out', label: 'Stock out', value: '−87', tone: 'critical' },
        ]}
      />
    </CardContent>
  </Card>
</div>
