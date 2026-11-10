<!-- Beside the run planner: the run as it stands, and what it still needs. -->
<script lang="ts">
  import {
    AsideCard,
    FactList,
    FactListItem,
    ReadinessChecklist,
    ReadinessSummary,
  } from '@jovertical/mise-design-system'
  import ListChecks from '@lucide/svelte/icons/list-checks'
  import ReceiptText from '@lucide/svelte/icons/receipt-text'

  import { driverOf, locationName, vehicleOf } from '#lib/data/lookups.js'
  import { shipmentReadiness } from '#lib/data/readiness.js'
  import type { ShipmentInput } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import { weight } from '#lib/format.js'

  let { values }: { values: ShipmentInput } = $props()

  const orders = $derived(store.data.orders.filter((order) => values.orderIds.includes(order.id)))

  const kilograms = $derived(
    orders.reduce(
      (sum, order) => sum + order.packages.reduce((total, pkg) => total + pkg.weightKg, 0),
      0,
    ),
  )

  const count = $derived(values.orderIds.length)
  const readiness = $derived(shipmentReadiness(values))
</script>

{#snippet receipt()}
  <ReceiptText />
{/snippet}
{#snippet checks()}
  <ListChecks />
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

<AsideCard icon={checks} title="Ready to schedule">
  <div class="flex flex-col gap-4">
    <ReadinessSummary items={readiness} />
    <ReadinessChecklist items={readiness} />
  </div>
</AsideCard>
