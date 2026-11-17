<!--
  Two columns for a breakdown with fewer parts: three columns and four items
  leaves an orphan. Tone colours one cell, the one that says where to look.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    MetricGrid,
    type MetricGridItem,
  } from '@jovertical/mise-design-system'

  const items: MetricGridItem[] = [
    { id: '1', label: 'Dock 1', value: '18 / 24', percent: 75, trailing: '75%' },
    { id: '2', label: 'Dock 2', value: '20 / 24', percent: 83, trailing: '83%' },
    { id: '3', label: 'Dock 3', value: '6 / 24', percent: 25, trailing: '25%' },
    { id: '4', label: 'Dock 4', value: '22 / 24', percent: 92, tone: 'warning', trailing: '92%' },
  ]
</script>

<Card class="w-full">
  <CardHeader><CardTitle>Capacity by dock</CardTitle></CardHeader>
  <CardContent><MetricGrid columns={2} {items} /></CardContent>
</Card>
