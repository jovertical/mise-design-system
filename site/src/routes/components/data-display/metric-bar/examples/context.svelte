<!-- A description under the label, a capacity on the bar's line, and an icon chip: what the row is about. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    MetricBar,
  } from '@jovertical/mise-design-system'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'

  const locations = [
    { name: 'Riverside', where: 'North district', used: 398, capacity: 500 },
    { name: 'Harbour', where: 'Waterfront', used: 321, capacity: 500 },
    { name: 'North yard', where: 'Industrial park', used: 321, capacity: 700 },
  ]
</script>

{#snippet icon()}
  <IconBuildingStore />
{/snippet}

<Card class="w-full max-w-2xl">
  <CardHeader><CardTitle>Stock by location</CardTitle></CardHeader>
  <CardContent stack="md">
    {#each locations as location (location.name)}
      <MetricBar
        {icon}
        label={location.name}
        description={location.where}
        value="{Math.round((location.used / location.capacity) * 100)}%"
        percent={(location.used / location.capacity) * 100}
        trailing="{location.used} / {location.capacity} units"
      />
    {/each}
  </CardContent>
</Card>
