import { type ProductInput, productSchema } from './schemas.js'
import { matches, type Source } from './shared.js'
import type { Product } from './types.js'

export type ProductFilters = { search?: string; category?: Product['category'] }

export const listProducts = (s: Source, filters: ProductFilters = {}): Product[] =>
  s.data.products
    .filter((product) => !filters.category || product.category === filters.category)
    .filter((product) => matches(filters.search, product.sku, product.name))

export function productStock(product: Product) {
  const onHand = product.stock.reduce((sum, row) => sum + row.onHand, 0)
  const reserved = product.stock.reduce((sum, row) => sum + row.reserved, 0)

  return { onHand, reserved, available: onHand - reserved }
}

export const lowStock = (s: Source) =>
  s.data.products.filter((product) => productStock(product).available < product.reorderPoint)

export const productToInput = (product: Product): ProductInput => ({
  name: product.name,
  sku: product.sku,
  category: product.category,
  unit: product.unit,
  price: product.price,
  reorderPoint: product.reorderPoint,
  openingStock: product.stock.map(({ locationId, onHand }) => ({ locationId, onHand })),
})

function parseProduct(s: Source, raw: ProductInput, id: string | null) {
  const input = productSchema.parse(raw)
  const taken = s.data.products.some((product) => product.sku === input.sku && product.id !== id)

  if (taken) throw new Error(`SKU ${input.sku} is already in use`)

  return input
}

export function createProduct(s: Source, raw: ProductInput): Product {
  const { openingStock, ...input } = parseProduct(s, raw, null)

  const product: Product = {
    ...input,
    id: `prd-${input.sku.toLowerCase()}`,
    stock: s.data.locations.map((location) => ({
      locationId: location.id,
      onHand: openingStock.find((row) => row.locationId === location.id)?.onHand ?? 0,
      reserved: 0,
    })),
  }

  s.data.products.push(product)

  return product
}

/** Everything but stock, which moves through adjustments rather than this form. */
export function updateProduct(s: Source, id: string, raw: ProductInput): Product {
  const product = s.data.products.find((candidate) => candidate.id === id)

  if (!product) throw new Error(`No product ${id}`)

  const { openingStock: _, ...input } = parseProduct(s, raw, product.id)

  Object.assign(product, input)

  return product
}

export const getProduct = (s: Source, idOrSku: string) =>
  s.data.products.find((product) => product.id === idOrSku || product.sku === idOrSku.toUpperCase())
