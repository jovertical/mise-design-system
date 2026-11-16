<!-- MetricBar rows, the list's most common content: a chip, two lines and a bar each. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardList,
    CardTitle,
    MetricBar,
  } from '@jovertical/mise-design-system'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'

  const LOCATIONS = [
    { name: 'Riverside', where: 'North district · 22 items', used: 398, capacity: 500 },
    { name: 'Harbour', where: 'Waterfront · 19 items', used: 321, capacity: 500 },
    { name: 'North yard', where: 'Industrial park · 19 items', used: 338, capacity: 450 },
  ]
</script>

{#snippet icon()}
  <IconBuildingStore />
{/snippet}

<Card class="w-full max-w-2xl">
  <CardHeader divided>
    <CardTitle>Stock by location</CardTitle>
    <CardDescription>Capacity and low-stock risk by location.</CardDescription>
  </CardHeader>
  <CardContent>
    <CardList>
      {#each LOCATIONS as row (row.name)}
        <MetricBar
          {icon}
          label={row.name}
          description={row.where}
          value="{Math.round((row.used / row.capacity) * 100)}%"
          percent={(row.used / row.capacity) * 100}
          trailing="{row.used} / {row.capacity} units"
        />
      {/each}
    </CardList>
  </CardContent>
</Card>
