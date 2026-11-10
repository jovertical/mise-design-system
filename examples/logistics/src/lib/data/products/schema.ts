/** What a form may submit and a write function may accept, for products: one schema for both. */
import { z } from 'zod'

import { cents } from '../shared.js'

const sku = z
  .string()
  .trim()
  .min(3, 'Enter a SKU')
  .regex(/^[A-Z0-9-]+$/, 'Capitals, digits and dashes only')

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Name the product'),
  sku,
  category: z.enum(['packaging', 'pallets', 'labels', 'cold-chain', 'safety']),
  unit: z.string().trim().min(1, 'Enter a unit'),
  price: cents.min(1, 'Enter a price'),
  reorderPoint: z.number().int('Whole units only').min(0, 'Cannot be negative'),
  /** On hand per site when the product is created; an edit leaves stock to adjustments. */
  openingStock: z.array(
    z.object({
      locationId: z.string(),
      onHand: z.number().int('Whole units only').min(0, 'Cannot be negative'),
    }),
  ),
})

/** What the product form edits. */
export type ProductInput = z.infer<typeof productSchema>
