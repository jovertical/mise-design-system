<!-- The overview's fleet status: where every vehicle is right now, as a bar and a count per status. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    FactList,
    FactListItem,
    SegmentedBar,
  } from '@jovertical/mise-design-system'

  import { fleetStatus, VEHICLE_STATUSES } from '#lib/data/fleet/index.js'
  import { store } from '#lib/data/store.svelte.js'
  import { VEHICLE_STATUS } from '#lib/status.js'

  const fleet = $derived(fleetStatus(store))

  const segments = $derived(
    VEHICLE_STATUSES.map((status) => ({
      label: VEHICLE_STATUS[status].label,
      value: fleet[status].count,
      tone: VEHICLE_STATUS[status].tone,
    })),
  )
</script>

<Card>
  <CardHeader>
    <CardTitle>Fleet status</CardTitle>
    <CardDescription>Where every vehicle is right now.</CardDescription>
  </CardHeader>
  <CardContent class="flex flex-col gap-4">
    <SegmentedBar {segments} />
    <FactList>
      {#each VEHICLE_STATUSES as status (status)}
        <FactListItem
          label={VEHICLE_STATUS[status].label}
          value="{fleet[status].count} {fleet[status].count === 1 ? 'vehicle' : 'vehicles'}"
        />
      {/each}
    </FactList>
  </CardContent>
</Card>
