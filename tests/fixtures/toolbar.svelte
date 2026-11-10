<script lang="ts">
  import {
    DataTable,
    type DataTableFilterState,
    DataTableToolbar,
    type DataTableViewMode,
  } from '../../src/lib/index.js'
  import { DEVICES, deviceColumns, STATUS_OPTIONS } from '../../stories/fixtures/devices.js'

  let {
    onFiltersChange,
    withViewToggle = false,
  }: { onFiltersChange?: (filters: DataTableFilterState) => void; withViewToggle?: boolean } =
    $props()

  let mode = $state<DataTableViewMode>('table')

  const filters = [
    { columnId: 'status', title: 'Status', options: STATUS_OPTIONS },
    { columnId: 'missing', title: 'Missing', options: STATUS_OPTIONS },
  ]
</script>

{#snippet card(device: (typeof DEVICES)[number])}
  <article>{device.serial}</article>
{/snippet}

<DataTable columns={deviceColumns} data={DEVICES} viewMode={mode} {card} {onFiltersChange}>
  {#snippet toolbar(table)}
    {#if withViewToggle}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search devices', debounceMs: 10 }}
        {filters}
        exports={{ getCopyText: () => 'x' }}
        bind:viewMode={mode}
      />
    {:else}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search devices', debounceMs: 10 }}
        {filters}
        exports={{ getCopyText: () => 'x' }}
      />
    {/if}
  {/snippet}
</DataTable>
