<!--
  One shipment: who is driving it, where it has been and where it is going,
  and what it carries. An unknown number renders ErrorState.
-->
<script lang="ts">
  import {
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
    Progress,
    StatTile,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
  } from '@jovertical/mise-design-system'
  import Check from '@lucide/svelte/icons/check'
  import IdCard from '@lucide/svelte/icons/id-card'
  import MapPin from '@lucide/svelte/icons/map-pin'
  import Pencil from '@lucide/svelte/icons/pencil'
  import Phone from '@lucide/svelte/icons/phone'
  import Truck from '@lucide/svelte/icons/truck'
  import Warehouse from '@lucide/svelte/icons/warehouse'
  import { nameThisPage } from '#lib/breadcrumb.svelte.js'
  import { clientOf, driverOf, locationName, vehicleOf } from '#lib/data/lookups.js'
  import { getOrder } from '#lib/data/orders.js'
  import { getShipment, isShipmentEditable, shipmentProgress } from '#lib/data/shipments.js'
  import { store } from '#lib/data/store.svelte.js'
  import { dateTime, money } from '#lib/format.js'
  import { ORDER_STATUS, SHIPMENT_STATUS } from '#lib/status.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const shipment = $derived(getShipment(store, page.params.id ?? ''))
  const vehicle = $derived(shipment ? vehicleOf(store, shipment.vehicleId) : undefined)
  const driver = $derived(shipment ? driverOf(store, shipment.driverId) : undefined)
  const orders = $derived(
    shipment
      ? shipment.orderIds.map((id) => getOrder(store, id)).filter((order) => order !== undefined)
      : [],
  )
  const delivered = $derived(shipment?.stops.filter((stop) => stop.deliveredAt).length ?? 0)

  nameThisPage(() => shipment?.number)
</script>

{#snippet back()}
  <Button href={resolve('/shipments')}>Back to shipments</Button>
{/snippet}
{#snippet truckIcon()}
  <Truck />
{/snippet}
{#snippet idIcon()}
  <IdCard />
{/snippet}
{#snippet phoneIcon()}
  <Phone />
{/snippet}
{#snippet warehouseIcon()}
  <Warehouse />
{/snippet}

{#if !shipment}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such shipment"
      description="That shipment number does not exist."
      homeLink={back}
    />
  </PageLayout>
{:else}
  {#snippet status()}
    <Badge tone={SHIPMENT_STATUS[shipment.status].tone}
      >{SHIPMENT_STATUS[shipment.status].label}</Badge
    >
  {/snippet}
  {#snippet actions()}
    {#if isShipmentEditable(shipment)}
      <Button variant="outline" href={resolve('/shipments/[id]/edit', { id: shipment.number })}>
        <Pencil />Edit
      </Button>
    {/if}
    {#if vehicle}
      <Button variant="outline" href={resolve('/fleet/[id]', { id: vehicle.code })}
        ><Truck />View vehicle</Button
      >
    {/if}
  {/snippet}
  {@const progress = shipmentProgress(shipment)}
  {#snippet progressBar()}
    <Progress value={progress} aria-label="Stops delivered" />
  {/snippet}

  <PageLayout>
    <PageHeader
      title={shipment.number}
      titleAccessory={status}
      description="From {locationName(store, shipment.originId)}, {shipment.stops.length} {shipment
        .stops.length === 1
        ? 'stop'
        : 'stops'}"
      {actions}
    />

    <div class="grid gap-4 sm:grid-cols-3">
      <StatTile
        label="Stops delivered"
        value="{delivered} of {shipment.stops.length}"
        footer={progressBar}
      />
      <StatTile label="Orders carried" value={orders.length} />
      <StatTile
        label="Order value"
        value={money(orders.reduce((sum, order) => sum + order.total, 0))}
      />
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <div class="flex flex-col gap-4 lg:col-span-2">
        <Card>
          <CardHeader><CardTitle>Route</CardTitle></CardHeader>
          <CardContent>
            <Timeline>
              {#each shipment.stops as stop, index (index)}
                <TimelineItem>
                  <TimelineDot tone={stop.deliveredAt ? 'success' : 'neutral'}>
                    {#if stop.deliveredAt}
                      <Check />
                    {:else}
                      <MapPin />
                    {/if}
                  </TimelineDot>
                  {#if index < shipment.stops.length - 1}
                    <TimelineConnector />
                  {/if}
                  <TimelineTitle class={stop.deliveredAt ? '' : 'text-muted-foreground'}
                    >{stop.address}</TimelineTitle
                  >
                  <TimelineContent>
                    <p>
                      {stop.deliveredAt
                        ? `Delivered ${dateTime(stop.deliveredAt)}`
                        : `Due ${dateTime(stop.eta)}`}
                    </p>
                  </TimelineContent>
                </TimelineItem>
              {/each}
            </Timeline>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Orders on board</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Deliver to</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead numeric>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {#each orders as order (order.id)}
                  <TableRow>
                    <TableCell>
                      <a
                        class="font-medium underline-offset-4 hover:underline"
                        href={resolve('/orders/[id]', { id: order.number })}
                      >
                        {order.number}
                      </a>
                    </TableCell>
                    <TableCell>{clientOf(store, order.clientId)?.name}</TableCell>
                    <TableCell>{order.destination}</TableCell>
                    <TableCell
                      ><Badge tone={ORDER_STATUS[order.status].tone}
                        >{ORDER_STATUS[order.status].label}</Badge
                      ></TableCell
                    >
                    <TableCell numeric>{money(order.total)}</TableCell>
                  </TableRow>
                {/each}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card class="self-start">
        <CardHeader><CardTitle>Crew and vehicle</CardTitle></CardHeader>
        <CardContent>
          <FactList>
            <FactListItem
              orientation="vertical"
              icon={truckIcon}
              label="Vehicle"
              value="{vehicle?.code} · {vehicle?.registration}"
            />
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
              icon={warehouseIcon}
              label="Leaves from"
              value={locationName(store, shipment.originId)}
            />
          </FactList>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
{/if}
