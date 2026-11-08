<script lang="ts">
  import { DataTable } from '../../src/lib/index.js'
  import { DEVICES, deviceColumns } from '../../stories/fixtures/devices.js'
  import { deviceRowsOf, LOCATION_ROWS, locationColumns } from '../../stories/fixtures/locations.js'

  let {
    view,
    isFetchingNextPage = false,
    fetchNextPage,
  }: {
    view: 'grid' | 'expandable' | 'more'
    isFetchingNextPage?: boolean
    fetchNextPage?: () => void
  } = $props()
</script>

{#snippet card(device: (typeof DEVICES)[number])}
  <article data-testid="card">{device.serial}</article>
{/snippet}

{#if view === 'grid'}
  <DataTable
    columns={deviceColumns}
    data={DEVICES}
    viewMode="grid"
    {card}
    getItemKey={(d) => d.id}
  />
{:else if view === 'expandable'}
  <DataTable
    columns={locationColumns}
    data={LOCATION_ROWS}
    getSubRows={deviceRowsOf}
    getRowId={(row) => row.id}
  />
{:else}
  <DataTable
    columns={deviceColumns}
    data={DEVICES}
    hasNextPage
    {isFetchingNextPage}
    {fetchNextPage}
  />
{/if}
