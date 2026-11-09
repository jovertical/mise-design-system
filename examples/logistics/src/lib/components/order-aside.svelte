<!-- Beside the order form: what the order adds up to so far, and what it still needs. -->
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

  import { clientOf, locationName } from '#lib/data/lookups.js'
  import { orderReadiness } from '#lib/data/readiness.js'
  import type { OrderInput } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import { money, weight } from '#lib/format.js'
  import { SERVICE_LABEL } from '#lib/status.js'

  let { values }: { values: OrderInput } = $props()

  const kilograms = $derived(values.packages.reduce((sum, pkg) => sum + pkg.weightKg, 0))
  const count = $derived(values.packages.length)
  const readiness = $derived(orderReadiness(values))
</script>

{#snippet receipt()}
  <ReceiptText />
{/snippet}
{#snippet checks()}
  <ListChecks />
{/snippet}

<AsideCard icon={receipt} title="Summary">
  <FactList>
    <FactListItem label="Client" value={clientOf(store, values.clientId)?.name} />
    <FactListItem label="Service" value={SERVICE_LABEL[values.service]} />
    <FactListItem label="Ships from" value={locationName(store, values.originId)} />
    <FactListItem label="Deliver to" value={values.destination.trim() || null} />
    <FactListItem
      label="Packages"
      value="{count} {count === 1 ? 'package' : 'packages'} · {weight(kilograms)}"
    />
    <FactListItem label="Total" value={values.total > 0 ? money(values.total) : null} />
  </FactList>
</AsideCard>

<AsideCard icon={checks} title="Ready to save">
  <div class="flex flex-col gap-4">
    <ReadinessSummary items={readiness} />
    <ReadinessChecklist items={readiness} />
  </div>
</AsideCard>
