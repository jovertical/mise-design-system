<!--
  Loading draws skeleton rows and no closing strip: a count of nothing is not
  information. An empty table shows its empty state across every column.
-->
<script lang="ts">
  import {
    DataTable,
    dataTableColumns,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
    ToggleGroup,
    ToggleGroupItem,
  } from '@jovertical/mise-design-system'

  type Delivery = { id: string; run: string; driver: string }

  const column = dataTableColumns<Delivery>()

  const columns = column.columns([
    column.accessor('run', { header: 'Run' }),
    column.accessor('driver', { header: 'Driver' }),
  ])

  let state = $state('loading')
</script>

{#snippet noDeliveries()}
  <Empty>
    <EmptyHeader>
      <EmptyTitle>No deliveries today</EmptyTitle>
      <EmptyDescription>Runs appear here once they are planned.</EmptyDescription>
    </EmptyHeader>
  </Empty>
{/snippet}

<div class="flex w-full flex-col gap-4">
  <ToggleGroup type="single" bind:value={state} aria-label="State">
    <ToggleGroupItem value="loading">Loading</ToggleGroupItem>
    <ToggleGroupItem value="empty">Empty</ToggleGroupItem>
  </ToggleGroup>
  <DataTable
    {columns}
    data={[] as Delivery[]}
    isLoading={state === 'loading'}
    emptyState={noDeliveries}
    withPadding={false}
  />
</div>
