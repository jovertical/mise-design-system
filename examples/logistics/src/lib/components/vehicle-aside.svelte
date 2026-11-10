<!-- Beside the vehicle form: the vehicle as it would be saved, and what it still needs. -->
<script lang="ts">
  import {
    AsideCard,
    Badge,
    FactList,
    FactListItem,
    ReadinessChecklist,
    ReadinessSummary,
  } from '@jovertical/mise-design-system'
  import ListChecks from '@lucide/svelte/icons/list-checks'
  import ReceiptText from '@lucide/svelte/icons/receipt-text'
  import { vehicleReadiness } from '#lib/data/fleet/readiness.js'
  import type { VehicleInput } from '#lib/data/fleet/schema.js'
  import { driverOf, locationName } from '#lib/data/lookups.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Vehicle } from '#lib/data/types.js'
  import { dateOf } from '#lib/format.js'
  import { CONDITION, VEHICLE_STATUS } from '#lib/status.js'

  let {
    values,
    status = null,
  }: {
    values: VehicleInput
    /** An existing vehicle's status, which moves on its own; a new one starts idle. */
    status?: Vehicle['status'] | null
  } = $props()

  const withYear = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const readiness = $derived(vehicleReadiness(values))
  const look = $derived(VEHICLE_STATUS[status ?? 'idle'])
</script>

{#snippet receipt()}
  <ReceiptText />
{/snippet}
{#snippet checks()}
  <ListChecks />
{/snippet}
{#snippet statusBadge()}
  <Badge tone={look.tone}>{look.label}</Badge>
{/snippet}
{#snippet conditionBadge()}
  <Badge tone={CONDITION[values.condition].tone}>{CONDITION[values.condition].label}</Badge>
{/snippet}

<AsideCard icon={receipt} title="Summary">
  <FactList>
    <FactListItem label="Vehicle" value={values.code.trim() || null} />
    <FactListItem label="Type" value={values.type === 'van' ? 'Van' : 'Truck'} />
    <FactListItem
      label="Home site"
      value={values.homeLocationId ? locationName(store, values.homeLocationId) : null}
    />
    <FactListItem label="Driver" value={driverOf(store, values.driverId)?.name ?? 'No driver'} />
    <FactListItem
      label="Next service"
      value={withYear.format(dateOf({ day: values.nextServiceDay, time: '00:00' }))}
    />
    <FactListItem label="Condition" value={conditionBadge} />
    <FactListItem label="Status" value={statusBadge} />
  </FactList>
</AsideCard>

<AsideCard icon={checks} title="Ready to save">
  <div class="flex flex-col gap-4">
    <ReadinessSummary items={readiness} />
    <ReadinessChecklist items={readiness} />
  </div>
</AsideCard>
