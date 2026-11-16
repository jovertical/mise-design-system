<!--
  The consumer skill's recipe: search, a faceted status filter (its column
  needs a filterFn), and a menu of actions on every row, named for its row.
-->
<script lang="ts">
  import {
    Badge,
    DataTable,
    DataTableColumnHeader,
    DataTableRowActions,
    DataTableToolbar,
    DropdownMenuItem,
    DropdownMenuSeparator,
    dataTableColumns,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
    type Tone,
  } from '@jovertical/mise-design-system'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'

  type Order = {
    id: string
    number: string
    location: string
    status: 'open' | 'ready' | 'collected' | 'refunded'
    /** Formatted by the app; mise has no opinion about currencies. */
    total: string
  }

  const orders: Order[] = [
    { id: '1', number: '#1042', location: 'Riverside', status: 'open', total: '$48.20' },
    { id: '2', number: '#1043', location: 'Riverside', status: 'ready', total: '$12.75' },
    { id: '3', number: '#1044', location: 'Harbour', status: 'collected', total: '$96.00' },
    { id: '4', number: '#1045', location: 'North yard', status: 'refunded', total: '$22.10' },
  ]

  const STATUS_TONE: Record<Order['status'], Tone> = {
    open: 'info',
    ready: 'success',
    collected: 'neutral',
    refunded: 'warning',
  }

  const STATUS_OPTIONS = [
    { label: 'Open', value: 'open' },
    { label: 'Ready', value: 'ready' },
    { label: 'Collected', value: 'collected' },
    { label: 'Refunded', value: 'refunded' },
  ]

  const column = dataTableColumns<Order>()

  const columns = column.columns([
    column.accessor('number', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Order' }),
    }),
    column.accessor('location', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Location' }),
    }),
    column.accessor('status', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Status' }),
      cell: ({ row }) => renderSnippet(statusCell, row.original),
      // The status filter passes a list of values; keep rows whose status is in it.
      filterFn: (row, id, values: string[]) => values.includes(row.getValue(id)),
    }),
    column.accessor('total', { header: 'Total', enableSorting: false }),
    column.display({
      id: 'actions',
      cell: ({ row }) => renderSnippet(actionsCell, row.original),
    }),
  ])
</script>

{#snippet statusCell(order: Order)}
  <Badge tone={STATUS_TONE[order.status]} class="capitalize">{order.status}</Badge>
{/snippet}

{#snippet actionsCell(order: Order)}
  <DataTableRowActions label={`Actions for order ${order.number}`}>
    <DropdownMenuItem>View order</DropdownMenuItem>
    <DropdownMenuItem>Print receipt</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="critical" disabled={order.status === 'refunded'}>
      Refund
    </DropdownMenuItem>
  </DataTableRowActions>
{/snippet}

{#snippet noOrders()}
  <Empty>
    <EmptyHeader>
      <EmptyTitle>No orders match</EmptyTitle>
      <EmptyDescription>Clear the search or the status filter.</EmptyDescription>
    </EmptyHeader>
  </Empty>
{/snippet}

<div class="w-full">
  <DataTable
    title="Today's orders"
    {columns}
    data={orders}
    defaultSort="-number"
    getRowId={(order) => order.id}
    emptyState={noOrders}
    withPadding={false}
  >
    {#snippet toolbar(table)}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search orders…' }}
        filters={[{ columnId: 'status', title: 'Status', options: STATUS_OPTIONS }]}
      />
    {/snippet}
  </DataTable>
</div>
