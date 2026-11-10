<!--
  Orders: the open counts, then every order in a searchable, filterable table.
  Create order goes to its own page; cancelling asks first.
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
    Button,
    PageHeader,
    PageLayout,
    Sparkline,
    StatTile,
    ToggleGroup,
    ToggleGroupItem,
    toast,
  } from '@jovertical/mise-design-system'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'
  import { latency } from '#modules/core/data/latency.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import OrdersBoard from '#modules/orders/components/orders-board.svelte'
  import OrdersTable from '#modules/orders/components/orders-table.svelte'
  import { cancelOrder, FLOW_STATUSES, orderStats } from '#modules/orders/data/index.js'
  import type { Order } from '#modules/orders/data/types.js'
  import { ORDER_STATUS } from '#modules/orders/utils/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  let loading = $state(true)

  $effect(() => {
    latency().then(() => (loading = false))
  })

  let cancelling = $state<Order | null>(null)

  const stats = $derived(orderStats(store))

  // The view lives in the URL, so it survives a reload and can be shared.
  const view = $derived(page.url.searchParams.get('view') === 'board' ? 'board' : 'table')

  function show(next: string) {
    if (!next || next === view) return

    const url = new URL(page.url.href)

    if (next === 'board') url.searchParams.set('view', 'board')
    else url.searchParams.delete('view')

    goto(url, { replace: true, reset: false })
  }

  function confirmCancel() {
    if (!cancelling) return

    try {
      const order = cancelOrder(store, cancelling.id)

      toast.success(`Order ${order.number} cancelled`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error))
    }

    cancelling = null
  }
</script>

{#snippet headerActions()}
  <Button href={resolve('/orders/new')}><IconPlus />Create order</Button>
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
    {#each FLOW_STATUSES as status (status)}
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

  <ToggleGroup
    type="single"
    value={view}
    onValueChange={show}
    variant="segmented"
    class="self-start"
  >
    <ToggleGroupItem value="table">Table</ToggleGroupItem>
    <ToggleGroupItem value="board">Board</ToggleGroupItem>
  </ToggleGroup>

  {#if view === 'board'}
    <OrdersBoard />
  {:else}
    <OrdersTable {loading} oncancel={(order) => (cancelling = order)} />
  {/if}
</PageLayout>

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
