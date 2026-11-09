<!-- One site: how full it is, by zone, and what is based there or leaving it. -->
<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    ErrorState,
    MetricBar,
    PageHeader,
    PageLayout,
    StatTile,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'
  import { nameThisPage } from '#lib/breadcrumb.svelte.js'
  import { store } from '#lib/data/store.svelte.js'
  import {
    getLocation,
    locationActivity,
    locationStock,
    utilisation,
    zoneShare,
  } from '#lib/data/warehouses.js'
  import { SHIPMENT_STATUS, VEHICLE_STATUS } from '#lib/status.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const location = $derived(getLocation(store, page.params.id ?? ''))
  const activity = $derived(
    location ? locationActivity(store, location.id) : { vehicles: [], outbound: [] },
  )
  const stock = $derived(location ? locationStock(store, location.id) : { skus: 0, units: 0 })

  nameThisPage(() => location?.name)
</script>

{#snippet back()}
  <Button href={resolve('/warehouses')}>Back to warehouses</Button>
{/snippet}

{#if !location}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such site"
      description="That warehouse does not exist."
      homeLink={back}
    />
  </PageLayout>
{:else}
  {@const used = utilisation(location)}
  <PageLayout>
    <PageHeader
      title={location.name}
      description="{location.city} · managed by {location.manager}"
    />

    <div class="grid gap-4 sm:grid-cols-4">
      <StatTile label="Capacity used" value="{used}%" tone={used >= 85 ? 'warning' : 'neutral'} />
      <StatTile label="Docks" value={location.docks} />
      <StatTile label="Products stocked" value={stock.skus} />
      <StatTile label="Units on hand" value={stock.units.toLocaleString('en-US')} />
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Zones</CardTitle></CardHeader>
        <CardContent class="flex flex-col gap-4">
          {#each location.zones as zone (zone.name)}
            {@const share = zoneShare(zone)}
            <MetricBar
              label={zone.name}
              value="{share}%"
              percent={share}
              trailing="{zone.used.toLocaleString('en-US')} / {zone.capacity.toLocaleString(
                'en-US',
              )}"
              tone={share >= 85 ? 'warning' : 'primary'}
            />
          {/each}
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader><CardTitle>Leaving this site</CardTitle></CardHeader>
        <CardContent>
          {#if activity.outbound.length}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {#each activity.outbound as shipment (shipment.id)}
                  <TableRow>
                    <TableCell>
                      <a
                        class="font-medium underline-offset-4 hover:underline"
                        href={resolve('/shipments/[id]', { id: shipment.number })}
                        >{shipment.number}</a
                      >
                    </TableCell>
                    <TableCell>{shipment.stops.length}</TableCell>
                    <TableCell
                      ><Badge tone={SHIPMENT_STATUS[shipment.status].tone}
                        >{SHIPMENT_STATUS[shipment.status].label}</Badge
                      ></TableCell
                    >
                  </TableRow>
                {/each}
              </TableBody>
            </Table>
          {:else}
            <p class="text-muted-foreground text-sm">Nothing leaving today.</p>
          {/if}
          <div class="mt-6 flex flex-col gap-2">
            <h3 class="text-sm font-medium">Vehicles based here</h3>
            <div class="flex flex-wrap gap-2">
              {#each activity.vehicles as vehicle (vehicle.id)}
                <a
                  href={resolve('/fleet/[id]', { id: vehicle.code })}
                  class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:border-foreground/20"
                >
                  <span class="font-medium">{vehicle.code}</span>
                  <Badge tone={VEHICLE_STATUS[vehicle.status].tone}
                    >{VEHICLE_STATUS[vehicle.status].label}</Badge
                  >
                </a>
              {/each}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
{/if}
