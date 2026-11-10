<!-- One vehicle in the fleet's grid view: what it is, where it is, when it is due. -->
<script lang="ts">
  import { Badge, Card, CardContent, FactList, FactListItem } from '@jovertical/mise-design-system'
  import { driverOf, locationName } from '#lib/data/lookups.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Vehicle } from '#lib/data/types.js'
  import { VEHICLE_STATUS } from '#lib/status.js'
  import { resolve } from '$app/paths'

  let { vehicle }: { vehicle: Vehicle } = $props()

  const dueIn = $derived(vehicle.nextServiceDay)

  const service = $derived(
    dueIn < 0 ? `${-dueIn} days overdue` : dueIn === 0 ? 'Today' : `In ${dueIn} days`,
  )
</script>

{#snippet serviceValue()}
  {#if dueIn <= 7}
    <Badge tone={dueIn < 0 ? 'critical' : 'warning'}>{service}</Badge>
  {:else}
    {service}
  {/if}
{/snippet}

<Card>
  <CardContent class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <a
        class="font-medium underline-offset-4 hover:underline"
        href={resolve('/fleet/[id]', { id: vehicle.code })}
      >
        {vehicle.code}
      </a>
      <Badge tone={VEHICLE_STATUS[vehicle.status].tone}
        >{VEHICLE_STATUS[vehicle.status].label}</Badge
      >
    </div>
    <span class="text-muted-foreground text-sm">
      {vehicle.registration}
      · {vehicle.type === 'van' ? 'Van' : 'Truck'} · {locationName(store, vehicle.homeLocationId)}
    </span>
    <FactList compact>
      <FactListItem label="Driver" value={driverOf(store, vehicle.driverId)?.name ?? null} />
      <FactListItem label="Mileage" value="{vehicle.mileageKm.toLocaleString('en-US')} km" />
      <FactListItem label="Next service" value={serviceValue} />
    </FactList>
  </CardContent>
</Card>
