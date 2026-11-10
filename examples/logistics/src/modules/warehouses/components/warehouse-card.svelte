<!-- One site: how full it is, who runs it, and how full each zone is. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    FactList,
    FactListItem,
    MetricBar,
    RadialStat,
  } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import { locationStock, utilisation, zoneShare } from '#modules/warehouses/data/index.js'
  import type { Location } from '#modules/warehouses/data/types.js'
  import { resolve } from '$app/paths'

  let { location }: { location: Location } = $props()

  /** A zone this full needs moving stock out, not more in. */
  const FULL = 85

  const used = $derived(utilisation(location))
  const stock = $derived(locationStock(store, location.id))
</script>

<Card>
  <CardHeader class="flex flex-row items-center gap-4">
    <RadialStat
      percent={used}
      diameter={56}
      tone={used >= FULL ? 'warning' : 'primary'}
      aria-label="{used}% of capacity used"
    />
    <div class="flex flex-col gap-1">
      <CardTitle>
        <a
          class="underline-offset-4 hover:underline"
          href={resolve('/warehouses/[id]', { id: location.id })}
        >
          {location.name}
        </a>
      </CardTitle>
      <CardDescription>{location.city} · {used}% of capacity used</CardDescription>
    </div>
  </CardHeader>
  <CardContent class="flex flex-col gap-5">
    <FactList>
      <FactListItem label="Manager" value={location.manager} />
      <FactListItem label="Docks" value={location.docks} />
      <FactListItem label="Products stocked" value={stock.skus} />
      <FactListItem label="Units on hand" value={stock.units.toLocaleString('en-US')} />
    </FactList>
    <div class="flex flex-col gap-3">
      {#each location.zones as zone (zone.name)}
        {@const share = zoneShare(zone)}
        <MetricBar
          label={zone.name}
          value="{share}%"
          percent={share}
          trailing="{zone.used.toLocaleString('en-US')} / {zone.capacity.toLocaleString('en-US')}"
          tone={share >= FULL ? 'warning' : 'primary'}
        />
      {/each}
    </div>
  </CardContent>
</Card>
