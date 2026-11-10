<!--
  Shipments: every one scheduled, moving or delivered. A row opens the
  shipment's own page.
-->
<script lang="ts">
  import {
    Badge,
    Button,
    DataTable,
    DataTableColumnHeader,
    DataTableToolbar,
    dataTableColumns,
    PageHeader,
    PageLayout,
    Progress,
  } from '@jovertical/mise-design-system'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import NoMatches from '#modules/core/components/no-matches.svelte'
  import { latency } from '#modules/core/data/latency.js'
  import { driverOf, locationName, vehicleOf } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime } from '#modules/core/utils/format.js'
  import { listShipments, shipmentProgress } from '#modules/shipments/data/index.js'
  import type { Shipment } from '#modules/shipments/data/types.js'
  import { SHIPMENT_STATUS } from '#modules/shipments/utils/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let loading = $state(true)

  $effect(() => {
    latency().then(() => (loading = false))
  })

  const shipments = $derived(listShipments(store))

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

{#snippet noMatches()}
  <NoMatches things="shipments" />
{/snippet}

<PageLayout>
  <PageHeader title="Shipments" description="Everything scheduled, on the road, or delivered.">
    {#snippet actions()}
      <Button href={resolve('/shipments/new')}><IconPlus />Plan a run</Button>
    {/snippet}
  </PageHeader>

  <DataTable
    {columns}
    data={shipments}
    getRowId={(shipment) => shipment.id}
    onRowClick={(shipment) => goto(resolve('/shipments/[id]', { id: shipment.number }))}
    isLoading={loading}
    emptyState={noMatches}
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
