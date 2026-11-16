<!-- Columns typed by dataTableColumns<Order>(), sortable through DataTableColumnHeader. -->
<script lang="ts">
  import {
    Badge,
    DataTable,
    DataTableColumnHeader,
    dataTableColumns,
    type Tone,
  } from '@jovertical/mise-design-system'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'

  type Order = { id: string; number: string; location: string; status: Status; total: string }
  type Status = 'open' | 'ready' | 'collected'

  const ORDERS: Order[] = [
    { id: '1', number: '#1042', location: 'Riverside', status: 'open', total: '$48.20' },
    { id: '2', number: '#1043', location: 'Riverside', status: 'ready', total: '$12.75' },
    { id: '3', number: '#1044', location: 'Harbour', status: 'collected', total: '$96.00' },
    { id: '4', number: '#1045', location: 'North yard', status: 'ready', total: '$22.10' },
  ]

  const STATUS_TONE: Record<Status, Tone> = { open: 'info', ready: 'success', collected: 'neutral' }

  const column = dataTableColumns<Order>()

  const columns = column.columns([
    column.accessor('number', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Order' }),
    }),
    column.accessor('location', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Location' }),
    }),
    column.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original.status),
    }),
    column.accessor('total', { header: 'Total', enableSorting: false }),
  ])
</script>

{#snippet statusCell(status: Status)}
  <Badge tone={STATUS_TONE[status]} class="capitalize">{status}</Badge>
{/snippet}

<div class="w-full">
  <DataTable
    title="Today's orders"
    {columns}
    data={ORDERS}
    defaultSort="-number"
    getRowId={(order) => order.id}
    withPadding={false}
  />
</div>
