import { productPatchSchema } from './schemas.js'
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

export function updateProduct(
  s: Source,
  id: string,
  patch: Pick<Product, 'price' | 'reorderPoint'>,
): Product {
  const product = s.data.products.find((candidate) => candidate.id === id)
  if (!product) throw new Error(`No product ${id}`)
  const { price, reorderPoint } = productPatchSchema.parse(patch)
  product.price = price
  product.reorderPoint = reorderPoint
  return product
}

export const getProduct = (s: Source, idOrSku: string) =>
  s.data.products.find((product) => product.id === idOrSku || product.sku === idOrSku.toUpperCase())
