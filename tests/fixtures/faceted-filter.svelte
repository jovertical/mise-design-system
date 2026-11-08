<script lang="ts">
  import {
    DataTable,
    DataTableFacetedFilter,
    type DataTableFilterState,
  } from '../../src/lib/index.js'
  import { DEVICES, deviceColumns, STATUS_OPTIONS } from '../../stories/fixtures/devices.js'

  let { onFiltersChange }: { onFiltersChange?: (filters: DataTableFilterState) => void } = $props()
</script>

<DataTable columns={deviceColumns} data={DEVICES} {onFiltersChange}>
  {#snippet toolbar(table)}
    <DataTableFacetedFilter
      column={table.getColumn('status')}
      title="Status"
      options={STATUS_OPTIONS}
    />
  {/snippet}
</DataTable>
