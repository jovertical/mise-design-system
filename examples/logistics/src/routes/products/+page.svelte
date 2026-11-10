<!--
  Products: stock across every warehouse. Available and reserved show as one
  bar per row; anything under its reorder point is called out above the
  table. New product and each row's Edit go to the product form.
-->
<script lang="ts">
  import {
    Alert,
    AlertDescription,
    AlertTitle,
    Badge,
    Button,
    DataTable,
    DataTableColumnHeader,
    DataTableRowActions,
    DataTableToolbar,
    DropdownMenuItem,
    dataTableColumns,
    PageHeader,
    PageLayout,
    SegmentedBar,
  } from '@jovertical/mise-design-system'
  import Plus from '@lucide/svelte/icons/plus'
  import TriangleAlert from '@lucide/svelte/icons/triangle-exclamation-point'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import NoMatches from '#lib/components/no-matches.svelte'
  import { latency } from '#lib/data/latency.js'
  import { listProducts, lowStock, productStock } from '#lib/data/products/index.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Product } from '#lib/data/types.js'
  import { money } from '#lib/format.js'
  import { CATEGORY_LABEL } from '#lib/status.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let loading = $state(true)

  $effect(() => {
    latency().then(() => (loading = false))
  })

  const products = $derived(listProducts(store))
  const low = $derived(lowStock(store))

  type StockLevel = 'in-stock' | 'low' | 'out'

  const LEVEL: Record<StockLevel, { label: string; tone: 'success' | 'warning' | 'critical' }> = {
    'in-stock': { label: 'In stock', tone: 'success' },
    low: { label: 'Low', tone: 'warning' },
    out: { label: 'Out', tone: 'critical' },
  }

  function levelOf(product: Product): StockLevel {
    const { available } = productStock(product)

    if (available <= 0) return 'out'

    return available < product.reorderPoint ? 'low' : 'in-stock'
  }

  const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABEL).map(([value, label]) => ({
    value,
    label,
  }))

  const column = dataTableColumns<Product>()

  const columns = column.columns([
    column.accessor('name', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Product' }),
      cell: ({ row }) => renderSnippet(productCell, row.original),
    }),
    column.accessor('category', {
      header: 'Category',
      cell: ({ row }) => renderSnippet(categoryCell, row.original),
      filterFn: (row, id, values: string[]) => values.includes(row.getValue(id)),
    }),
    column.display({
      id: 'stock',
      header: 'Stock',
      cell: ({ row }) => renderSnippet(stockCell, row.original),
    }),
    column.accessor('price', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Price' }),
      cell: ({ row }) => money(row.original.price),
    }),
    column.display({
      id: 'level',
      header: 'Status',
      cell: ({ row }) => renderSnippet(levelCell, row.original),
    }),
    column.display({
      id: 'actions',
      cell: ({ row }) => renderSnippet(actionsCell, row.original),
    }),
  ])
</script>

{#snippet productCell(product: Product)}
  <div class="flex flex-col">
    <span class="font-medium">{product.name}</span>
    <span class="text-muted-foreground text-xs">{product.sku} · per {product.unit}</span>
  </div>
{/snippet}
{#snippet categoryCell(product: Product)}
  <Badge variant="outline">{CATEGORY_LABEL[product.category]}</Badge>
{/snippet}
{#snippet stockCell(product: Product)}
  {@const stock = productStock(product)}
  <div class="flex w-48 flex-col gap-1">
    <SegmentedBar
      size="sm"
      showShare={false}
      showLabels={false}
      segments={[
        { label: 'Available', value: Math.max(stock.available, 0), tone: 'primary' },
        { label: 'Reserved', value: stock.reserved, tone: 'warning' },
      ]}
    />
    <span class="text-muted-foreground text-xs tabular-nums">
      {stock.available.toLocaleString('en-US')}
      available · {stock.reserved.toLocaleString('en-US')} reserved
    </span>
  </div>
{/snippet}
{#snippet levelCell(product: Product)}
  {@const level = levelOf(product)}
  <Badge tone={LEVEL[level].tone}>{LEVEL[level].label}</Badge>
{/snippet}
{#snippet actionsCell(product: Product)}
  <DataTableRowActions label={`Actions for ${product.name}`}>
    <DropdownMenuItem onSelect={() => goto(resolve('/products/[id]/edit', { id: product.sku }))}>
      Edit
    </DropdownMenuItem>
  </DataTableRowActions>
{/snippet}

{#snippet noMatches()}
  <NoMatches things="products" />
{/snippet}

<PageLayout>
  <PageHeader title="Products" description="Stock across every warehouse.">
    {#snippet actions()}
      <Button href={resolve('/products/new')}><Plus />New product</Button>
    {/snippet}
  </PageHeader>

  {#if low.length}
    <Alert variant="warning">
      <TriangleAlert />
      <AlertTitle>{low.length} products below their reorder point</AlertTitle>
      <AlertDescription>{low.map((product) => product.name).join(', ')}</AlertDescription>
    </Alert>
  {/if}

  <DataTable
    {columns}
    data={products}
    getRowId={(product) => product.id}
    onRowClick={(product) => goto(resolve('/products/[id]', { id: product.sku }))}
    isLoading={loading}
    emptyState={noMatches}
    withPadding={false}
  >
    {#snippet toolbar(table)}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search products or SKUs…' }}
        filters={[
          {
            columnId: 'category',
            title: 'Category',
            allLabel: 'All categories',
            options: CATEGORY_OPTIONS,
          },
        ]}
      />
    {/snippet}
  </DataTable>
</PageLayout>
