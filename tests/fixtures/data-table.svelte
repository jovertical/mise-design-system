<script lang="ts">
  import { DataTable, type DataTableFilterState } from '../../src/lib/index.js'
  import { DEVICES, type Device, deviceColumns } from '../../stories/fixtures/devices.js'

  let {
    data = DEVICES,
    isLoading = false,
    selection = false,
    withEmpty = false,
    withFooter = false,
    withToolbar = false,
    title,
    onFiltersChange,
    onRowClick,
  }: {
    data?: Device[]
    isLoading?: boolean
    selection?: boolean
    withEmpty?: boolean
    withFooter?: boolean
    withToolbar?: boolean
    title?: string
    onFiltersChange?: (filters: DataTableFilterState) => void
    onRowClick?: (device: Device) => void
  } = $props()
</script>

{#snippet empty()}
  <p>No devices</p>
{/snippet}
{#snippet footer()}
  <a href="#all">View all devices</a>
{/snippet}
{#snippet toolbar(table: import('../../src/lib/index.js').DataTableInstance<Device>)}
  <button type="button" onclick={() => table.getColumn('serial')?.toggleSorting(false)}>
    Sort by serial
  </button>
{/snippet}

<DataTable
  columns={deviceColumns}
  {data}
  {isLoading}
  {title}
  getRowId={(device) => device.id}
  enableRowSelection={selection}
  isRowSelectable={(device) => device.status !== 'pairing'}
  emptyState={withEmpty ? empty : undefined}
  footer={withFooter ? footer : undefined}
  toolbar={withToolbar ? toolbar : undefined}
  {onFiltersChange}
  {onRowClick}
/>
