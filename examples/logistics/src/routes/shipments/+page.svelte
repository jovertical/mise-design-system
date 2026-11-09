<!--
  Shipments: every one scheduled, moving or delivered. A row opens a sheet
  with its stops as a timeline; `?open=<id>` opens it on load, which is how
  an order's page links here.
-->
<script lang="ts">
  import {
    Badge,
    DataTable,
    DataTableColumnHeader,
    DataTableToolbar,
    dataTableColumns,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
    FactList,
    FactListItem,
    PageHeader,
    PageLayout,
    Progress,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
  } from '@jovertical/mise-design-system'
  import Check from '@lucide/svelte/icons/check'
  import MapPin from '@lucide/svelte/icons/map-pin'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import { latency } from '#lib/data/latency.js'
  import { driverOf, locationName, vehicleOf } from '#lib/data/lookups.js'
  import { getShipment, listShipments, shipmentProgress } from '#lib/data/shipments.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Shipment } from '#lib/data/types.js'
  import { dateTime } from '#lib/format.js'
  import { SHIPMENT_STATUS } from '#lib/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  let loading = $state(true)
  $effect(() => {
    latency().then(() => (loading = false))
  })

  const shipments = $derived(listShipments(store))
  const openId = $derived(page.url.searchParams.get('open'))
  const open = $derived(openId ? getShipment(store, openId) : undefined)

  function setOpen(id: string | null) {
    const url = new URL(page.url.href)
    if (id) url.searchParams.set('open', id)
    else url.searchParams.delete('open')
    goto(url, { replace: true, reset: false })
  }

  const nextEta = (shipment: Shipment) =>
    (shipment.stops.find((stop) => !stop.deliveredAt) ?? shipment.stops.at(-1))?.eta

  const STATUS_OPTIONS = Object.entries(SHIPMENT_STATUS).map(([value, look]) => ({
    value,
    label: look.label,
  }))
  const DRIVER_OPTIONS = $derived(
    store.data.drivers.map((driver) => ({ value: driver.id, label: driver.name })),
  )

  const inList = (row: { getValue: (id: string) => unknown }, id: string, values: string[]) =>
    values.includes(String(row.getValue(id)))

  const column = dataTableColumns<Shipment>()
  const columns = column.columns([
    column.accessor('number', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Shipment' }),
    }),
    column.accessor('driverId', {
      header: 'Vehicle and driver',
      cell: ({ row }) => renderSnippet(vehicleCell, row.original),
      filterFn: inList,
    }),
    column.display({
      id: 'origin',
      header: 'From',
      cell: ({ row }) => locationName(store, row.original.originId),
    }),
    column.display({
      id: 'stops',
      header: 'Stops',
      cell: ({ row }) => String(row.original.stops.length),
    }),
    column.display({
      id: 'eta',
      header: 'Next ETA',
      cell: ({ row }) => {
        const eta = nextEta(row.original)
        return eta ? dateTime(eta) : '—'
      },
    }),
    column.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
      filterFn: inList,
    }),
    column.display({
      id: 'progress',
      header: 'Progress',
      cell: ({ row }) => renderSnippet(progressCell, row.original),
    }),
  ])
</script>

{#snippet vehicleCell(shipment: Shipment)}
  <div class="flex flex-col">
    <span class="font-medium">{vehicleOf(store, shipment.vehicleId)?.code}</span>
    <span class="text-muted-foreground text-xs">{driverOf(store, shipment.driverId)?.name}</span>
  </div>
{/snippet}
{#snippet statusCell(shipment: Shipment)}
  <Badge tone={SHIPMENT_STATUS[shipment.status].tone}
    >{SHIPMENT_STATUS[shipment.status].label}</Badge
  >
{/snippet}
{#snippet progressCell(shipment: Shipment)}
  <Progress value={shipmentProgress(shipment)} class="w-24" aria-label="Stops delivered" />
{/snippet}
{#snippet noShipments()}
  <Empty>
    <EmptyHeader>
      <EmptyTitle>No shipments match</EmptyTitle>
      <EmptyDescription>Clear the search or the filters.</EmptyDescription>
    </EmptyHeader>
  </Empty>
{/snippet}

<PageLayout>
  <PageHeader title="Shipments" description="Everything scheduled, on the road, or delivered." />

  <DataTable
    {columns}
    data={shipments}
    getRowId={(shipment) => shipment.id}
    onRowClick={(shipment) => setOpen(shipment.id)}
    isLoading={loading}
    emptyState={noShipments}
    withPadding={false}
  >
    {#snippet toolbar(table)}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search shipments…' }}
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            allLabel: 'All statuses',
            options: STATUS_OPTIONS,
          },
          {
            columnId: 'driverId',
            title: 'Driver',
            allLabel: 'All drivers',
            options: DRIVER_OPTIONS,
          },
        ]}
      />
    {/snippet}
  </DataTable>
</PageLayout>

<Sheet
  open={open !== undefined}
  onOpenChange={(next) => {
    if (!next) setOpen(null)
  }}
>
  <SheetContent class="w-full overflow-y-auto sm:max-w-md">
    {#if open}
      {@const progress = shipmentProgress(open)}
      <SheetHeader>
        <SheetTitle class="flex items-center gap-2">
          {open.number}
          <Badge tone={SHIPMENT_STATUS[open.status].tone}
            >{SHIPMENT_STATUS[open.status].label}</Badge
          >
        </SheetTitle>
        <SheetDescription>
          {vehicleOf(store, open.vehicleId)?.code}
          · {driverOf(store, open.driverId)?.name} · from
          {locationName(store, open.originId)}
        </SheetDescription>
      </SheetHeader>

      <div class="flex flex-col gap-6 px-4 pb-4">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Stops delivered</span>
            <span class="tabular-nums">{progress}%</span>
          </div>
          <Progress value={progress} aria-label="Stops delivered" />
        </div>

        <Timeline>
          {#each open.stops as stop, index (index)}
            <TimelineItem>
              <TimelineDot tone={stop.deliveredAt ? 'success' : 'neutral'}>
                {#if stop.deliveredAt}
                  <Check />
                {:else}
                  <MapPin />
                {/if}
              </TimelineDot>
              {#if index < open.stops.length - 1}
                <TimelineConnector />
              {/if}
              <TimelineTitle class={stop.deliveredAt ? '' : 'text-muted-foreground'}>
                {stop.address}
              </TimelineTitle>
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

        {#snippet orderLinks()}
          <span class="flex flex-wrap justify-end gap-x-3">
            {#each open.orderIds as orderId (orderId)}
              <a
                class="font-medium underline-offset-4 hover:underline"
                href={resolve('/orders/[id]', { id: orderId.toUpperCase() })}
              >
                {orderId.toUpperCase()}
              </a>
            {/each}
          </span>
        {/snippet}
        <FactList>
          <FactListItem
            label={open.orderIds.length === 1 ? 'Order' : 'Orders'}
            value={orderLinks}
          />
        </FactList>
      </div>
    {/if}
  </SheetContent>
</Sheet>
