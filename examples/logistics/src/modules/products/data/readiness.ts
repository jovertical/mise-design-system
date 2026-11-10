/** What a new or edited products record still needs before it can be saved. */
import type { ReadinessItem } from '@jovertical/mise-design-system'

import { readinessRow } from '#modules/core/data/shared.js'
import { type ProductInput, productSchema } from './schema.js'

export const productReadiness = (values: ProductInput): ReadinessItem[] => [
  readinessRow('name', 'Named', values.name.trim().length >= 2),
  readinessRow('sku', 'SKU', productSchema.shape.sku.safeParse(values.sku).success),
  readinessRow('unit', 'Unit', values.unit.trim() !== ''),
  readinessRow('price', 'Price set', values.price > 0),
]
