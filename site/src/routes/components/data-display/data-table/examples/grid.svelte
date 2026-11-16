<!--
  The same rows as a grid of cards. The view toggle owns the mode; the toolbar
  sits above the grid, since there is no card to hold it.
-->
<script lang="ts">
  import {
    Badge,
    Card,
    CardContent,
    DataTable,
    type DataTableViewMode,
    DataTableViewToggle,
    dataTableColumns,
    type Tone,
  } from '@jovertical/mise-design-system'

  type Vehicle = { id: string; name: string; location: string; status: Status }
  type Status = 'loading' | 'on a run' | 'in service'

  const VEHICLES: Vehicle[] = [
    { id: 'van-12', name: 'Van 12', location: 'Riverside', status: 'loading' },
    { id: 'truck-212', name: 'Truck 212', location: 'Harbour', status: 'on a run' },
    { id: 'van-07', name: 'Van 07', location: 'North yard', status: 'in service' },
  ]

  const STATUS_TONE: Record<Status, Tone> = {
    loading: 'info',
    'on a run': 'success',
    'in service': 'warning',
  }

  const column = dataTableColumns<Vehicle>()

  const columns = column.columns([
    column.accessor('name', { header: 'Vehicle' }),
    column.accessor('location', { header: 'Location' }),
    column.accessor('status', { header: 'Status' }),
  ])

  let mode: DataTableViewMode = $state('grid')
</script>

<div class="w-full">
  <DataTable
    {columns}
    data={VEHICLES}
    viewMode={mode}
    getItemKey={(vehicle) => vehicle.id}
    withPadding={false}
  >
    {#snippet toolbar()}
      <div class="flex items-center justify-end">
        <DataTableViewToggle bind:value={mode} />
      </div>
    {/snippet}
    {#snippet card(vehicle)}
      <Card>
        <CardContent class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="font-heading text-sm">{vehicle.name}</span>
            <Badge tone={STATUS_TONE[vehicle.status]}>{vehicle.status}</Badge>
          </div>
          <span class="text-muted-foreground text-xs">{vehicle.location}</span>
        </CardContent>
      </Card>
    {/snippet}
  </DataTable>
</div>
