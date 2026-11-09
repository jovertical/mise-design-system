<!--
  Fleet: every vehicle, as a table or as cards. Vehicles due for service
  within a week are called out above the list.
-->
<script lang="ts">
  import {
    Alert,
    AlertDescription,
    AlertTitle,
    Badge,
    DataTable,
    DataTableColumnHeader,
    DataTableToolbar,
    dataTableColumns,
    PageHeader,
    PageLayout,
  } from '@jovertical/mise-design-system'
  import Wrench from '@lucide/svelte/icons/wrench'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import NoMatches from '#lib/components/no-matches.svelte'
  import VehicleCard from '#lib/components/vehicle-card.svelte'
  import { listVehicles, serviceDueSoon } from '#lib/data/fleet.js'
  import { latency } from '#lib/data/latency.js'
  import { driverOf, locationName } from '#lib/data/lookups.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Vehicle } from '#lib/data/types.js'
  import { VEHICLE_STATUS } from '#lib/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let loading = $state(true)
  $effect(() => {
    latency().then(() => (loading = false))
  })

  let viewMode = $state<'table' | 'grid'>('grid')

  const vehicles = $derived(listVehicles(store))
  const due = $derived(serviceDueSoon(store))

  const STATUS_OPTIONS = Object.entries(VEHICLE_STATUS).map(([value, look]) => ({
    value,
    label: look.label,
  }))

  const column = dataTableColumns<Vehicle>()
  const columns = column.columns([
    column.accessor('code', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Vehicle' }),
    }),
    column.accessor('registration', { header: 'Registration' }),
    column.accessor('type', {
      header: 'Type',
      cell: ({ row }) => (row.original.type === 'van' ? 'Van' : 'Truck'),
    }),
    column.display({
      id: 'driver',
      header: 'Driver',
      cell: ({ row }) => driverOf(store, row.original.driverId)?.name ?? '—',
    }),
    column.display({
      id: 'home',
      header: 'Home',
      cell: ({ row }) => locationName(store, row.original.homeLocationId),
    }),
    column.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
      filterFn: (row, id, values: string[]) => values.includes(row.getValue(id)),
    }),
    column.accessor('mileageKm', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Mileage' }),
      cell: ({ row }) => `${row.original.mileageKm.toLocaleString('en-US')} km`,
    }),
    column.accessor('nextServiceDay', {
      header: ({ column }) =>
        renderComponent(DataTableColumnHeader, { column, title: 'Next service' }),
      cell: ({ row }) => renderSnippet(serviceCell, row.original),
    }),
  ])
</script>

{#snippet statusCell(vehicle: Vehicle)}
  <Badge tone={VEHICLE_STATUS[vehicle.status].tone}>{VEHICLE_STATUS[vehicle.status].label}</Badge>
{/snippet}
{#snippet serviceCell(vehicle: Vehicle)}
  {@const days = vehicle.nextServiceDay}
  {#if days <= 7}
    <Badge tone={days < 0 ? 'critical' : 'warning'}>
      {days < 0 ? `${-days} days overdue` : `In ${days} days`}
    </Badge>
  {:else}
    In {days} days
  {/if}
{/snippet}

{#snippet noMatches()}
  <NoMatches things="vehicles" />
{/snippet}

<PageLayout>
  <PageHeader
    title="Fleet"
    description="{vehicles.length} vehicles across {store.data.locations.length} sites."
  />

  {#if due.length}
    <Alert variant="warning">
      <Wrench />
      <AlertTitle>{due.length} vehicles due for service within a week</AlertTitle>
      <AlertDescription>{due.map((vehicle) => vehicle.code).join(', ')}</AlertDescription>
    </Alert>
  {/if}

  <DataTable
    {columns}
    data={vehicles}
    {viewMode}
    getRowId={(vehicle) => vehicle.id}
    onRowClick={(vehicle) => goto(resolve('/fleet/[id]', { id: vehicle.code }))}
    getItemKey={(vehicle) => vehicle.id}
    isLoading={loading}
    emptyState={noMatches}
    withPadding={false}
  >
    {#snippet toolbar(table)}
      <DataTableToolbar
        {table}
        bind:viewMode
        search={{ placeholder: 'Search vehicles…' }}
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            allLabel: 'All statuses',
            options: STATUS_OPTIONS,
          },
        ]}
      />
    {/snippet}
    {#snippet card(vehicle)}
      <VehicleCard {vehicle} />
    {/snippet}
  </DataTable>
</PageLayout>
