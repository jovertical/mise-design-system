<!-- The overview's active shipments: the five most urgent runs, with where each is headed next. -->
<script lang="ts">
  import {
    Badge,
    Button,
    DataTable,
    dataTableColumns,
    Progress,
  } from '@jovertical/mise-design-system'
  import { renderSnippet } from '@tanstack/svelte-table'

  import { driverOf, locationName, vehicleOf } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime } from '#modules/core/utils/format.js'
  import { activeShipments, shipmentProgress } from '#modules/shipments/data/index.js'
  import type { Shipment } from '#modules/shipments/data/types.js'
  import { SHIPMENT_STATUS } from '#modules/shipments/utils/status.js'
  import { resolve } from '$app/paths'

  let { loading }: { loading: boolean } = $props()

  const active = $derived(activeShipments(store))

  const nextStop = (shipment: Shipment) =>
    shipment.stops.find((stop) => !stop.deliveredAt) ?? shipment.stops.at(-1)

  const column = dataTableColumns<Shipment>()

  const columns = column.columns([
    column.display({
      id: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => renderSnippet(vehicleCell, row.original),
    }),
    column.accessor('number', { header: 'Shipment' }),
    column.display({
      id: 'route',
      header: 'Route',
      cell: ({ row }) => renderSnippet(routeCell, row.original),
    }),
    column.display({
      id: 'eta',
      header: 'Next ETA',
      cell: ({ row }) => dateTime(nextStop(row.original)?.eta ?? { day: 0, time: '—' }),
    }),
    column.display({
      id: 'status',
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
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
{#snippet routeCell(shipment: Shipment)}
  <span class="text-muted-foreground"
    >{locationName(store, shipment.originId)}
    → {nextStop(shipment)?.address}</span
  >
{/snippet}
{#snippet statusCell(shipment: Shipment)}
  <Badge tone={SHIPMENT_STATUS[shipment.status].tone}
    >{SHIPMENT_STATUS[shipment.status].label}</Badge
  >
{/snippet}
{#snippet progressCell(shipment: Shipment)}
  <Progress value={shipmentProgress(shipment)} class="w-24" aria-label="Stops delivered" />
{/snippet}
{#snippet viewAll()}
  <Button variant="ghost" size="sm" href={resolve('/shipments')}>View all shipments</Button>
{/snippet}
<DataTable
  title="Active shipments"
  description="{active.length} shipments scheduled or on the road."
  {columns}
  data={active.slice(0, 5)}
  getRowId={(shipment) => shipment.id}
  isLoading={loading}
  footer={viewAll}
  withPadding={false}
/>
