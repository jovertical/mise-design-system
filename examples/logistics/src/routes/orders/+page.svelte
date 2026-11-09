<!--
  Orders: the open counts, then every order in a searchable, filterable table.
  Create order opens a sheet; cancelling asks first.
-->
<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Avatar,
    AvatarFallback,
    Badge,
    Button,
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
    EntityLabel,
    PageHeader,
    PageLayout,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    Sparkline,
    StatTile,
    toast,
  } from '@jovertical/mise-design-system'
  import Plus from '@lucide/svelte/icons/plus'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import OrderForm from '#lib/components/order-form.svelte'
  import { latency } from '#lib/data/latency.js'
  import { clientOf, initials, locationName } from '#lib/data/lookups.js'
  import {
    cancelOrder,
    createOrder,
    listOrders,
    type NewOrder,
    OPEN_STATUSES,
    orderStats,
  } from '#lib/data/orders.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Order } from '#lib/data/types.js'
  import { dateTime, money, weight } from '#lib/format.js'
  import { ORDER_STATUS, SERVICE_LABEL, SOURCE_LABEL } from '#lib/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let loading = $state(true)
  $effect(() => {
    latency().then(() => (loading = false))
  })

  let creating = $state(false)
  let cancelling = $state<Order | null>(null)

  const stats = $derived(orderStats(store))
  const orders = $derived(listOrders(store))

  const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([value, look]) => ({
    value,
    label: look.label,
  }))

  function create(input: NewOrder) {
    const order = createOrder(store, input)
    creating = false
    toast.success(`Order ${order.number} created`)
  }

  function confirmCancel() {
    if (!cancelling) return
    const order = cancelOrder(store, cancelling.id)
    toast.success(`Order ${order.number} cancelled`)
    cancelling = null
  }

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
      variant="destructive"
      disabled={order.status === 'completed' || order.status === 'cancelled'}
      onSelect={() => (cancelling = order)}
    >
      Cancel order
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

{#snippet headerActions()}
  <Button onclick={() => (creating = true)}><Plus />Create order</Button>
{/snippet}

{#snippet trendOf(trend: number[])}
  <Sparkline data={trend} height={36} />
{/snippet}

<PageLayout>
  <PageHeader
    title="Orders"
    description="Review incoming requests and turn ready orders into shipments."
    actions={headerActions}
  />

  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {#each OPEN_STATUSES as status (status)}
      {#snippet visual()}
        {@render trendOf(stats[status].trend)}
      {/snippet}
      <StatTile
        label={ORDER_STATUS[status].label}
        value={stats[status].count}
        unit="orders"
        {visual}
        {loading}
      />
    {/each}
  </div>

  <DataTable
    {columns}
    data={orders}
    getRowId={(order) => order.id}
    onRowClick={(order) => goto(resolve('/orders/[id]', { id: order.number }))}
    isLoading={loading}
    emptyState={noOrders}
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
</PageLayout>

<Sheet bind:open={creating}>
  <SheetContent class="w-full overflow-y-auto sm:max-w-lg">
    <SheetHeader>
      <SheetTitle>New order</SheetTitle>
      <SheetDescription>It arrives as Received, ready for review.</SheetDescription>
    </SheetHeader>
    <div class="px-4 pb-4">
      {#if creating}
        <OrderForm onsubmit={create} oncancel={() => (creating = false)} />
      {/if}
    </div>
  </SheetContent>
</Sheet>

<AlertDialog
  open={cancelling !== null}
  onOpenChange={(open) => {
    if (!open) cancelling = null
  }}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Cancel {cancelling?.number}?</AlertDialogTitle>
      <AlertDialogDescription>The client is not told automatically.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep the order</AlertDialogCancel>
      <AlertDialogAction tone="critical" onclick={confirmCancel}>Cancel order</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
