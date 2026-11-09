<!--
  Edit order: the order form on an open order. A completed or cancelled order
  is kept as it was, so it gets a stop instead of the form.
-->
<script lang="ts">
  import { Button, ErrorState, PageLayout, toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import OrderForm from '#lib/components/order-form.svelte'
  import { getOrder, isOrderEditable, orderToInput, updateOrder } from '#lib/data/orders.js'
  import type { OrderInput } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import { ORDER_STATUS } from '#lib/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const order = $derived(getOrder(store, page.params.id ?? ''))

  markThisPage('Edit', () => order?.number)

  function save(values: OrderInput) {
    if (!order) return
    const saved = updateOrder(store, order.id, values)
    toast.success(`${saved.number} saved`)
    goto(resolve('/orders/[id]', { id: saved.number }))
  }
</script>

{#snippet backToOrders()}
  <Button href={resolve('/orders')}>Back to orders</Button>
{/snippet}

{#if !order}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such order"
      description="That order number does not exist, or the demo data was reset."
      homeLink={backToOrders}
    />
  </PageLayout>
{:else if !isOrderEditable(order)}
  {#snippet backToOrder()}
    <Button href={resolve('/orders/[id]', { id: order.number })}>Back to {order.number}</Button>
  {/snippet}
  <PageLayout>
    <ErrorState
      title="{order.number} can't be edited"
      description="It is {ORDER_STATUS[
        order.status
      ].label.toLowerCase()}. Completed and cancelled orders are kept as they were."
      homeLink={backToOrder}
    />
  </PageLayout>
{:else}
  {#key order.id}
    <OrderForm
      initial={orderToInput(order)}
      {save}
      page={{
        title: 'Edit order',
        description: 'Change the client, route, packages or total. Status moves on its own.',
        back: {
          href: resolve('/orders/[id]', { id: order.number }),
          label: `Back to ${order.number}`,
        },
        submitLabel: 'Save changes',
      }}
    />
  {/key}
{/if}
