<!-- Beside the site form: how full the site would be, and what it still needs. -->
<script lang="ts">
  import {
    AsideCard,
    FactList,
    FactListItem,
    Progress,
    ReadinessChecklist,
    ReadinessSummary,
    Text,
  } from '@jovertical/mise-design-system'
  import ListChecks from '@lucide/svelte/icons/list-checks'
  import ReceiptText from '@lucide/svelte/icons/receipt-text'

  import { siteReadiness } from '#lib/data/readiness.js'
  import type { SiteInput } from '#lib/data/schemas.js'
  import { percent } from '#lib/data/shared.js'

  let {
    values,
    used = [],
  }: {
    values: SiteInput
    /** What each existing zone holds, by position; empty for a new site. */
    used?: number[]
  } = $props()

  const held = $derived(values.zones.reduce((sum, _, index) => sum + (used[index] ?? 0), 0))
  const capacity = $derived(values.zones.reduce((sum, zone) => sum + zone.capacity, 0))
  const share = $derived(percent(held, capacity))
  const readiness = $derived(siteReadiness(values))
  const count = (n: number) => n.toLocaleString('en-US')
</script>

{#snippet receipt()}
  <ReceiptText />
{/snippet}
{#snippet checks()}
  <ListChecks />
{/snippet}

<AsideCard icon={receipt} title="Summary">
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline justify-between">
        <Text size="sm" muted>Zone capacity used</Text>
        <Text size="sm" weight="medium" class="tabular-nums">{share}%</Text>
      </div>
      <Progress value={share} />
      <Text size="sm" muted class="tabular-nums">
        {count(held)}
        of {count(capacity)} units across the zones
      </Text>
    </div>
    <FactList>
      <FactListItem label="Site" value={values.name.trim() || null} />
      <FactListItem label="Manager" value={values.manager.trim() || null} />
      <FactListItem label="Docks" value={values.docks || null} />
      <FactListItem label="Zones" value={values.zones.length} />
    </FactList>
  </div>
</AsideCard>

<AsideCard icon={checks} title="Ready to save">
  <div class="flex flex-col gap-4">
    <ReadinessSummary items={readiness} />
    <ReadinessChecklist items={readiness} />
  </div>
</AsideCard>
