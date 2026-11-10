<!-- Beside the product form: price and stock against the reorder point, and what is missing. -->
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

  import { productReadiness } from '#lib/data/products/readiness.js'
  import type { ProductInput } from '#lib/data/products/schema.js'
  import type { Product } from '#lib/data/types.js'
  import { money } from '#lib/format.js'
  import { CATEGORY_LABEL } from '#lib/status.js'

  let {
    values,
    stock = null,
  }: {
    values: ProductInput
    /** An existing product's stock, read-only; absent on a new one, which has opening stock. */
    stock?: Product['stock'] | null
  } = $props()

  // Available is what is on hand and not already promised to an order.
  const available = $derived(
    stock
      ? stock.reduce((sum, row) => sum + row.onHand - row.reserved, 0)
      : values.openingStock.reduce((sum, row) => sum + row.onHand, 0),
  )

  const low = $derived(available < values.reorderPoint)

  const units = (count: number) =>
    `${count.toLocaleString('en-US')} ${values.unit.trim() || 'units'}`

  const readiness = $derived(productReadiness(values))
</script>

{#snippet receipt()}
  <ReceiptText />
{/snippet}
{#snippet checks()}
  <ListChecks />
{/snippet}
{#snippet level()}
  <Badge tone={low ? 'warning' : 'success'}>{low ? 'Low stock' : 'In stock'}</Badge>
{/snippet}

<AsideCard icon={receipt} title="Summary">
  <FactList>
    <FactListItem label="Product" value={values.name.trim() || null} />
    <FactListItem label="Category" value={CATEGORY_LABEL[values.category]} />
    <FactListItem label="Price" value={values.price > 0 ? money(values.price) : null} />
    <FactListItem label={stock ? 'Available' : 'Opening stock'} value={units(available)} />
    <FactListItem label="Reorder point" value={units(values.reorderPoint)} />
    <FactListItem label="Level" value={level} />
  </FactList>
</AsideCard>

<AsideCard icon={checks} title="Ready to save">
  <div class="flex flex-col gap-4">
    <ReadinessSummary items={readiness} />
    <ReadinessChecklist items={readiness} />
  </div>
</AsideCard>
