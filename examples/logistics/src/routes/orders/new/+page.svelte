<!-- New order: an empty order form; it arrives as Received, ready for review. -->
<script lang="ts">
  import { toast } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import OrderForm from '#modules/orders/components/order-form.svelte'
  import { createOrder } from '#modules/orders/data/index.js'
  import type { OrderInput } from '#modules/orders/data/schema.js'
  import { markThisPage } from '#modules/shell/utils/breadcrumb.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  markThisPage('New order')

  const initial: OrderInput = {
    clientId: '',
    service: 'regular',
    originId: 'loc-riverside',
    destination: '',
    packages: [{ contents: '', weightKg: 0 }],
    total: 0,
  }

  function save(values: OrderInput) {
    const order = createOrder(store, values)

    toast.success(`${order.number} created`)

    goto(resolve('/orders/[id]', { id: order.number }))
  }
</script>

<OrderForm
  {initial}
  {save}
  page={{
    title: 'New order',
    description: 'Who it is for, where it goes and what it carries. It arrives as Received.',
    back: { href: resolve('/orders'), label: 'Back to Orders' },
    submitLabel: 'Create order',
  }}
/>
