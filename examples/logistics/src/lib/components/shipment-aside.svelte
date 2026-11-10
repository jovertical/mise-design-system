<!-- Beside the run planner: the run as it stands, and what it still needs. -->
<script lang="ts">
  import { AsideCard, FactList, FactListItem } from '@jovertical/mise-design-system'
  import ReceiptText from '@lucide/svelte/icons/receipt-text'

  import ReadinessCard from '#lib/components/readiness-card.svelte'

  import { driverOf, locationName, vehicleOf } from '#lib/data/lookups.js'
  import { shipmentReadiness } from '#lib/data/shipments/readiness.js'
  import type { ShipmentInput } from '#lib/data/shipments/schema.js'
  import { store } from '#lib/data/store.svelte.js'
  import { weight } from '#lib/format.js'

  let { values }: { values: ShipmentInput } = $props()

  const orders = $derived(store.data.orders.filter((order) => values.orderIds.includes(order.id)))

  const kilograms = $derived(
    orders.reduce(
      (sum, order) => sum + order.packages.reduce((total, item) => total + item.weightKg, 0),
      0,
    ),
  )

  const count = $derived(values.orderIds.length)
  const readiness = $derived(shipmentReadiness(values))
</script>

{#snippet receipt()}
  <ReceiptText />
{/snippet}

<AsideCard icon={receipt} title="Summary">
  <FactList>
    <FactListItem
      label="From"
      value={values.originId ? locationName(store, values.originId) : null}
    />
    <FactListItem label="Vehicle" value={vehicleOf(store, values.vehicleId)?.code} />
    <FactListItem label="Driver" value={driverOf(store, values.driverId)?.name} />
    <FactListItem
      label="Orders"
      value={count ? `${count} ${count === 1 ? 'order' : 'orders'} · ${weight(kilograms)}` : null}
    />
    <FactListItem label="Stops" value={count || null} />
  </FactList>
</AsideCard>

<ReadinessCard items={readiness} title="Ready to schedule" />
