/** The products module's entities. */
import type { Cents, Id } from '#modules/core/data/types.js'

export type Product = {
  id: Id
  sku: string
  name: string
  category: 'packaging' | 'pallets' | 'labels' | 'cold-chain' | 'safety'
  unit: string
  price: Cents
  reorderPoint: number
  stock: { locationId: Id; onHand: number; reserved: number }[]
}
