<!-- New product: an empty product form, with an opening count for every site. -->
<script lang="ts">
  import { toast } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import ProductForm from '#modules/products/components/product-form.svelte'
  import { createProduct } from '#modules/products/data/index.js'
  import type { ProductInput } from '#modules/products/data/schema.js'
  import { markThisPage } from '#modules/shell/utils/breadcrumb.svelte.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  markThisPage('New product')

  const initial: ProductInput = {
    name: '',
    sku: '',
    category: 'packaging',
    unit: '',
    price: 0,
    reorderPoint: 0,
    openingStock: store.data.locations.map((location) => ({ locationId: location.id, onHand: 0 })),
  }

  function save(values: ProductInput) {
    const product = createProduct(store, values)

    toast.success(`${product.name} added`)

    goto(resolve('/products/[id]', { id: product.sku }))
  }
</script>

<ProductForm
  {initial}
  {save}
  page={{
    title: 'New product',
    description: 'What it is, what it costs, and what is on the shelf today.',
    back: { href: resolve('/products'), label: 'Back to Products' },
    submitLabel: 'Add product',
  }}
/>
