<!--
  A subject, the figures that describe it, and one bar under the whole row. The
  bar runs under the icon chip too: it summarises the row, not one figure.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardList,
    CardTitle,
    MetricRow,
    type MetricRowStat,
  } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'

  type Location = {
    name: string
    where: string
    available: number
    low: number
    out: number
    onHand: number
    capacity: number
  }

  const locations: Location[] = [
    {
      name: 'Riverside',
      where: 'North district · 22 items',
      available: 80,
      low: 3,
      out: 1,
      onHand: 398,
      capacity: 500,
    },
    {
      name: 'Harbour',
      where: 'Waterfront · 19 items',
      available: 64,
      low: 3,
      out: 0,
      onHand: 321,
      capacity: 500,
    },
    {
      name: 'North yard',
      where: 'Industrial park · 16 items',
      available: 46,
      low: 1,
      out: 2,
      onHand: 321,
      capacity: 700,
    },
  ]

  function stockStats(location: Location): MetricRowStat[] {
    return [
      { id: 'available', label: 'Available', value: `${location.available}%` },
      {
        id: 'low',
        label: 'Low stock',
        value: location.low,
        tone: location.low > 0 ? 'warning' : 'neutral',
      },
      {
        id: 'out',
        label: 'Out of stock',
        value: location.out,
        tone: location.out > 0 ? 'critical' : 'neutral',
      },
    ]
  }
</script>

{#snippet icon()}
  <IconBuildingWarehouse />
{/snippet}

<Card class="w-full max-w-2xl">
  <CardHeader divided>
    <CardTitle>Stock by location</CardTitle>
    <CardDescription>Availability and low-stock risk by location.</CardDescription>
  </CardHeader>
  <CardContent>
    <CardList>
      {#each locations as location (location.name)}
        <MetricRow
          {icon}
          label={location.name}
          description={location.where}
          stats={stockStats(location)}
          percent={location.available}
          trailing="{location.onHand} / {location.capacity} units"
        />
      {/each}
    </CardList>
  </CardContent>
</Card>
