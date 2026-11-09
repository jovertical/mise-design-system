<!-- Edit product: the product form on an existing product, its stock read-only. -->
<script lang="ts">
  import { Button, ErrorState, PageLayout, toast } from '@jovertical/mise-design-system'
  import { markThisPage } from '#lib/breadcrumb.svelte.js'
  import ProductForm from '#lib/components/product-form.svelte'
  import { getProduct, productToInput, updateProduct } from '#lib/data/products.js'
  import type { ProductInput } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const product = $derived(getProduct(store, page.params.id ?? ''))

  markThisPage('Edit', () => product?.name)

  function save(values: ProductInput) {
    if (!product) return
    const saved = updateProduct(store, product.id, values)
    toast.success(`${saved.name} saved`)
    goto(resolve('/products/[id]', { id: saved.sku }))
  }
</script>

{#snippet backToProducts()}
  <Button href={resolve('/products')}>Back to products</Button>
{/snippet}

{#if !product}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such product"
      description="That SKU does not exist."
      homeLink={backToProducts}
    />
  </PageLayout>
{:else}
  {#key product.id}
    <ProductForm
      initial={productToInput(product)}
      stock={product.stock}
      {save}
      page={{
        title: 'Edit product',
        description: 'Change what it is, its price or its reorder point.',
        back: {
          href: resolve('/products/[id]', { id: product.sku }),
          label: `Back to ${product.name}`,
        },
        submitLabel: 'Save changes',
      }}
    />
  {/key}
{/if}
