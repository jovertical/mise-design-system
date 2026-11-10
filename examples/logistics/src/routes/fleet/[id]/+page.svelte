<!-- One vehicle: its state, its service, who drives it and what it has run. -->
<script lang="ts">
  import {
    Alert,
    AlertDescription,
    AlertTitle,
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    ErrorState,
    FactList,
    FactListItem,
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
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconCalendarClock from '@tabler/icons-svelte-runes/icons/calendar-clock'
  import IconGauge from '@tabler/icons-svelte-runes/icons/gauge'
  import IconId from '@tabler/icons-svelte-runes/icons/id'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconPhone from '@tabler/icons-svelte-runes/icons/phone'
  import IconTool from '@tabler/icons-svelte-runes/icons/tool'
  import { driverOf, locationName } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { shortDate } from '#modules/core/utils/format.js'
  import { getVehicle, vehicleShipments } from '#modules/fleet/data/index.js'
  import { CONDITION, VEHICLE_STATUS } from '#modules/fleet/utils/status.js'
  import { nameThisPage } from '#modules/shell/utils/breadcrumb.svelte.js'
  import { shipmentProgress } from '#modules/shipments/data/index.js'
  import { SHIPMENT_STATUS } from '#modules/shipments/utils/status.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const vehicle = $derived(getVehicle(store, page.params.id ?? ''))
  const driver = $derived(vehicle ? driverOf(store, vehicle.driverId) : undefined)
  const runs = $derived(vehicle ? vehicleShipments(store, vehicle.id) : [])
  const due = $derived(vehicle?.nextServiceDay ?? 0)

  nameThisPage(() => vehicle?.code)
</script>

{#snippet back()}
  <Button href={resolve('/fleet')}>Back to the fleet</Button>
{/snippet}
{#snippet idIcon()}
  <IconId />
{/snippet}
{#snippet phoneIcon()}
  <IconPhone />
{/snippet}
{#snippet homeIcon()}
  <IconBuildingWarehouse />
{/snippet}
{#snippet gaugeIcon()}
  <IconGauge />
{/snippet}
{#snippet serviceIcon()}
  <IconCalendarClock />
{/snippet}

{#if !vehicle}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such vehicle"
      description="That vehicle code does not exist."
      homeLink={back}
    />
  </PageLayout>
{:else}
  {#snippet status()}
    <Badge tone={VEHICLE_STATUS[vehicle.status].tone}>{VEHICLE_STATUS[vehicle.status].label}</Badge>
  {/snippet}
  <PageLayout>
    <PageHeader
      title={vehicle.code}
      titleAccessory={status}
      description="{vehicle.type === 'van'
        ? 'Van'
        : 'Truck'} · {vehicle.registration} · based at {locationName(
        store,
        vehicle.homeLocationId,
      )}"
    >
      {#snippet actions()}
        <Button variant="outline" href={resolve('/fleet/[id]/edit', { id: vehicle.code })}>
          <IconPencil />Edit
        </Button>
      {/snippet}
    </PageHeader>

    {#if due <= 7}
      <Alert variant="warning">
        <IconTool />
        <AlertTitle
          >{due < 0 ? `Service ${-due} days overdue` : `Service due in ${due} days`}</AlertTitle
        >
        <AlertDescription>Book it in before the next long run.</AlertDescription>
      </Alert>
    {/if}

    <div class="grid gap-4 sm:grid-cols-3">
      <StatTile label="Mileage" value="{vehicle.mileageKm.toLocaleString('en-US')} km" />
      <StatTile
        label="Condition"
        value={CONDITION[vehicle.condition].label}
        tone={CONDITION[vehicle.condition].tone}
        description={CONDITION[vehicle.condition].note}
      />
      <StatTile label="Shipments run" value={runs.length} />
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader><CardTitle>Shipments</CardTitle></CardHeader>
        <CardContent>
          {#if runs.length}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead numeric>Delivered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {#each runs as run (run.id)}
                  <TableRow>
                    <TableCell>
                      <a
                        class="font-medium underline-offset-4 hover:underline"
                        href={resolve('/shipments/[id]', { id: run.number })}
                        >{run.number}</a
                      >
                    </TableCell>
                    <TableCell>{locationName(store, run.originId)}</TableCell>
                    <TableCell>{run.stops.length}</TableCell>
                    <TableCell
                      ><Badge tone={SHIPMENT_STATUS[run.status].tone}
                        >{SHIPMENT_STATUS[run.status].label}</Badge
                      ></TableCell
                    >
                    <TableCell numeric>{shipmentProgress(run)}%</TableCell>
                  </TableRow>
                {/each}
              </TableBody>
            </Table>
          {:else}
            <p class="text-muted-foreground text-sm">No shipments yet.</p>
          {/if}
        </CardContent>
      </Card>

      <Card class="self-start">
        <CardHeader><CardTitle>Assignment</CardTitle></CardHeader>
        <CardContent>
          <FactList>
            <FactListItem
              orientation="vertical"
              icon={idIcon}
              label="Driver"
              value={driver?.name ?? null}
            />
            <FactListItem
              orientation="vertical"
              icon={phoneIcon}
              label="Driver's phone"
              value={driver?.phone ?? null}
            />
            <FactListItem
              orientation="vertical"
              icon={homeIcon}
              label="Home site"
              value={locationName(store, vehicle.homeLocationId)}
            />
            <FactListItem
              orientation="vertical"
              icon={gaugeIcon}
              label="Mileage"
              value="{vehicle.mileageKm.toLocaleString('en-US')} km"
            />
            <FactListItem
              orientation="vertical"
              icon={serviceIcon}
              label="Next service"
              value={shortDate({ day: due, time: '09:00' })}
            />
          </FactList>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
{/if}
