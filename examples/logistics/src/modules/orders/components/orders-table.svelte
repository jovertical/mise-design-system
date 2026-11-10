<!-- The orders as a table: searchable, filtered by status, each row opening its order. -->
<script lang="ts">
  import {
    Avatar,
    AvatarFallback,
    Badge,
    DataTable,
    DataTableColumnHeader,
    DataTableRowActions,
    DataTableToolbar,
    DropdownMenuItem,
    DropdownMenuSeparator,
    dataTableColumns,
    EntityLabel,
  } from '@jovertical/mise-design-system'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'

  import NoMatches from '#modules/core/components/no-matches.svelte'
  import { clientOf, initials, locationName } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime, money, weight } from '#modules/core/utils/format.js'
  import { listOrders } from '#modules/orders/data/index.js'
  import type { Order } from '#modules/orders/data/types.js'
  import { ORDER_STATUS, SERVICE_LABEL, SOURCE_LABEL } from '#modules/orders/utils/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let { loading, oncancel }: { loading: boolean; oncancel: (order: Order) => void } = $props()

  const orders = $derived(listOrders(store))

  const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([value, look]) => ({
    value,
    label: look.label,
  }))

  const column = dataTableColumns<Order>()

  const columns = column.columns([
    column.accessor('number', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Order' }),
      cell: ({ row }) => renderSnippet(orderCell, row.original),
    }),
    column.display({
      id: 'client',
      header: 'Client',
      cell: ({ row }) => renderSnippet(clientCell, row.original),
    }),
    column.display({
      id: 'route',
      header: 'Route',
      cell: ({ row }) => renderSnippet(routeCell, row.original),
    }),
    column.accessor('service', {
      header: 'Service',
      cell: ({ row }) => SERVICE_LABEL[row.original.service],
    }),
    column.display({
      id: 'packages',
      header: 'Packages',
      cell: ({ row }) => renderSnippet(packagesCell, row.original),
    }),
    column.accessor('total', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Total' }),
      cell: ({ row }) => money(row.original.total),
    }),
    column.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
      // The status filter passes the chosen values; keep rows whose status is among them.
      filterFn: (row, id, values: string[]) => values.includes(row.getValue(id)),
    }),
    column.display({
      id: 'actions',
      cell: ({ row }) => renderSnippet(actionsCell, row.original),
    }),
  ])
</script>

{#snippet orderCell(order: Order)}
  <div class="flex flex-col gap-0.5">
    <span class="font-medium">{order.number}</span>
    <span class="text-muted-foreground flex items-center gap-1.5 text-xs">
      {dateTime(order.placedAt)}
      <Badge variant="outline">{SOURCE_LABEL[order.source]}</Badge>
    </span>
  </div>
{/snippet}

{#snippet clientCell(order: Order)}
  {@const client = clientOf(store, order.clientId)}
  {#snippet avatar()}
    <Avatar class="size-8"><AvatarFallback>{initials(client?.name ?? '?')}</AvatarFallback></Avatar>
  {/snippet}
  <EntityLabel title={client?.name ?? '—'} description={client?.industry} media={avatar} />
{/snippet}

{#snippet routeCell(order: Order)}
  <div class="flex flex-col">
    <span>{locationName(store, order.originId)}</span>
    <span class="text-muted-foreground text-xs">→ {order.destination}</span>
  </div>
{/snippet}

{#snippet packagesCell(order: Order)}
  <div class="flex flex-col">
    <span>{order.packages.length} {order.packages.length === 1 ? 'package' : 'packages'}</span>
    <span class="text-muted-foreground text-xs">
      {weight(order.packages.reduce((sum, item) => sum + item.weightKg, 0))}
    </span>
  </div>
{/snippet}

{#snippet statusCell(order: Order)}
  <Badge tone={ORDER_STATUS[order.status].tone}>{ORDER_STATUS[order.status].label}</Badge>
{/snippet}

{#snippet actionsCell(order: Order)}
  <DataTableRowActions label={`Actions for order ${order.number}`}>
    <DropdownMenuItem>Print packing slip</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      tone="critical"
      disabled={order.status === 'completed' || order.status === 'cancelled'}
      onSelect={() => oncancel(order)}
    >
      Cancel order
    </DropdownMenuItem>
  </DataTableRowActions>
{/snippet}

{#snippet noMatches()}
  <NoMatches things="orders" />
{/snippet}

<DataTable
  {columns}
  data={orders}
  getRowId={(order) => order.id}
  onRowClick={(order) => goto(resolve('/orders/[id]', { id: order.number }))}
  isLoading={loading}
  emptyState={noMatches}
  withPadding={false}
>
  {#snippet toolbar(table)}
    <DataTableToolbar
      {table}
      search={{ placeholder: 'Search orders or clients…' }}
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
</DataTable>
