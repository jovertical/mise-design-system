<!-- One product: what it costs, how much there is and where. -->
<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    ErrorState,
    FactList,
    FactListItem,
    MetricBar,
    PageHeader,
    PageLayout,
    SegmentedBar,
    StatTile,
  } from '@jovertical/mise-design-system'
  import Barcode from '@lucide/svelte/icons/barcode'
  import Box from '@lucide/svelte/icons/box'
  import DollarSign from '@lucide/svelte/icons/dollar-sign'
  import Pencil from '@lucide/svelte/icons/pencil'
  import Tag from '@lucide/svelte/icons/tag'
  import { nameThisPage } from '#lib/breadcrumb.svelte.js'
  import { locationName } from '#lib/data/lookups.js'
  import { getProduct, productStock } from '#lib/data/products/index.js'
  import { store } from '#lib/data/store.svelte.js'
  import { money } from '#lib/format.js'
  import { CATEGORY_LABEL } from '#lib/status.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const product = $derived(getProduct(store, page.params.id ?? ''))
  const stock = $derived(product ? productStock(product) : { onHand: 0, reserved: 0, available: 0 })
  const low = $derived(product ? stock.available < product.reorderPoint : false)

  nameThisPage(() => product?.name)
</script>

{#snippet back()}
  <Button href={resolve('/products')}>Back to products</Button>
{/snippet}
{#snippet skuIcon()}
  <Barcode />
{/snippet}
{#snippet tagIcon()}
  <Tag />
{/snippet}
{#snippet boxIcon()}
  <Box />
{/snippet}
{#snippet priceIcon()}
  <DollarSign />
{/snippet}

{#if !product}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such product"
      description="That SKU does not exist."
      homeLink={back}
    />
  </PageLayout>
{:else}
  {#snippet status()}
    <Badge tone={low ? 'warning' : 'success'}>{low ? 'Low stock' : 'In stock'}</Badge>
  {/snippet}
  {#snippet actions()}
    <Button variant="outline" href={resolve('/products/[id]/edit', { id: product.sku })}>
      <Pencil />Edit
    </Button>
  {/snippet}
  <PageLayout>
    <PageHeader
      title={product.name}
      titleAccessory={status}
      description="{product.sku} · {CATEGORY_LABEL[product.category]}"
      {actions}
    />

    <div class="grid gap-4 sm:grid-cols-4">
      <StatTile
        label="Available"
        value={stock.available.toLocaleString('en-US')}
        unit={product.unit}
        tone={low ? 'warning' : 'neutral'}
      />
      <StatTile
        label="Reserved"
        value={stock.reserved.toLocaleString('en-US')}
        unit={product.unit}
      />
      <StatTile label="On hand" value={stock.onHand.toLocaleString('en-US')} unit={product.unit} />
      <StatTile label="Stock value" value={money(stock.onHand * product.price)} />
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader><CardTitle>Stock by site</CardTitle></CardHeader>
        <CardContent class="flex flex-col gap-5">
          <SegmentedBar
            segments={[
              { label: 'Available', value: Math.max(stock.available, 0), tone: 'primary' },
              { label: 'Reserved', value: stock.reserved, tone: 'warning' },
            ]}
          />
          {#each product.stock as row (row.locationId)}
            <MetricBar
              label={locationName(store, row.locationId)}
              value="{row.onHand.toLocaleString('en-US')} on hand"
              percent={stock.onHand ? Math.round((row.onHand / stock.onHand) * 100) : 0}
              trailing="{row.reserved} reserved"
            />
          {/each}
        </CardContent>
      </Card>

      <Card class="self-start">
        <CardHeader><CardTitle>Product</CardTitle></CardHeader>
        <CardContent>
          <FactList>
            <FactListItem orientation="vertical" icon={skuIcon} label="SKU" value={product.sku} />
            <FactListItem
              orientation="vertical"
              icon={tagIcon}
              label="Category"
              value={CATEGORY_LABEL[product.category]}
            />
            <FactListItem
              orientation="vertical"
              icon={priceIcon}
              label="Price"
              value="{money(product.price)} per {product.unit}"
            />
            <FactListItem
              orientation="vertical"
              icon={boxIcon}
              label="Reorder point"
              value="{product.reorderPoint} {product.unit}"
            />
          </FactList>
        </CardContent>
      </Card>
    </div>
  </PageLayout>
{/if}
