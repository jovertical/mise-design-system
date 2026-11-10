<!-- Beside the client form: who the client is so far, and what it still needs. -->
<script lang="ts">
  import { AsideCard, Badge, FactList, FactListItem } from '@jovertical/mise-design-system'
  import IconFileInvoice from '@tabler/icons-svelte-runes/icons/file-invoice'
  import { clientReadiness } from '#modules/clients/data/readiness.js'
  import type { ClientInput } from '#modules/clients/data/schema.js'
  import { CLIENT_STATUS } from '#modules/clients/utils/status.js'
  import ReadinessCard from '#modules/core/components/readiness-card.svelte'
  import type { Cents } from '#modules/core/data/types.js'
  import { money } from '#modules/core/utils/format.js'

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
  <IconFileInvoice />
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
