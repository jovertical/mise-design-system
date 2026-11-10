<!-- Beside the client form: who the client is so far, and what it still needs. -->
<script lang="ts">
  import { AsideCard, Badge, FactList, FactListItem } from '@jovertical/mise-design-system'
  import ReceiptText from '@lucide/svelte/icons/receipt-text'

  import ReadinessCard from '#lib/components/readiness-card.svelte'

  import { clientReadiness } from '#lib/data/clients/readiness.js'
  import type { ClientInput } from '#lib/data/clients/schema.js'
  import type { Cents } from '#lib/data/types.js'
  import { money } from '#lib/format.js'
  import { CLIENT_STATUS } from '#lib/status.js'

  let {
    values,
    worth = null,
  }: {
    values: ClientInput
    /** An existing client's order values, read-only; absent on a new one. */
    worth?: { lifetime: Cents; open: Cents } | null
  } = $props()

  const readiness = $derived(clientReadiness(values))
</script>

{#snippet receipt()}
  <ReceiptText />
{/snippet}
{#snippet status()}
  <Badge tone={CLIENT_STATUS[values.status].tone}>{CLIENT_STATUS[values.status].label}</Badge>
{/snippet}

<AsideCard icon={receipt} title="Summary">
  <FactList>
    <FactListItem label="Name" value={values.name.trim() || null} />
    <FactListItem label="Industry" value={values.industry.trim() || null} />
    <FactListItem label="Contact" value={values.contact.trim() || null} />
    <FactListItem label="Email" value={values.email.trim() || null} />
    <FactListItem label="Status" value={status} />
    {#if worth}
      <FactListItem label="Open order value" value={money(worth.open)} />
      <FactListItem label="Lifetime value" value={money(worth.lifetime)} />
    {/if}
  </FactList>
</AsideCard>

<ReadinessCard items={readiness} />
