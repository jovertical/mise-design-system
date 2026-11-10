/** How the products module's statuses and labels show: one map each, so every screen agrees. */
import type { Product } from '#modules/products/data/types.js'

export const CATEGORY_LABEL: Record<Product['category'], string> = {
  packaging: 'Packaging',
  pallets: 'Pallets',
  labels: 'Labels',
  'cold-chain': 'Cold chain',
  safety: 'Safety',
}
