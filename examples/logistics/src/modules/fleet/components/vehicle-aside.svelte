<!-- Beside the vehicle form: the vehicle as it would be saved, and what it still needs. -->
<script lang="ts">
  import { AsideCard, Badge, FactList, FactListItem } from '@jovertical/mise-design-system'
  import ReceiptText from '@lucide/svelte/icons/receipt-text'

  import ReadinessCard from '#modules/core/components/readiness-card.svelte'
  import { driverOf, locationName } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateOf } from '#modules/core/utils/format.js'
  import { vehicleReadiness } from '#modules/fleet/data/readiness.js'
  import type { VehicleInput } from '#modules/fleet/data/schema.js'
  import type { Vehicle } from '#modules/fleet/data/types.js'
  import { CONDITION, VEHICLE_STATUS } from '#modules/fleet/utils/status.js'

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

<ReadinessCard items={readiness} />
