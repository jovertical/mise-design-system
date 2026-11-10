/** What a form may submit and a write function may accept, for orders: one schema for both. */
import { z } from 'zod'

import { cents } from '../shared.js'

export const orderSchema = z.object({
  clientId: z.string().min(1, 'Choose a client'),
  service: z.enum(['regular', 'express', 'same-day']),
  originId: z.string().min(1, 'Choose where it ships from'),
  destination: z.string().trim().min(3, 'Enter the delivery address'),
  packages: z
    .array(
      z.object({
        contents: z.string().trim().min(1, 'Say what is in it'),
        weightKg: z.number().positive('Enter a weight'),
      }),
    )
    .min(1, 'Add a package'),
  total: cents.min(1, 'Enter the order total'),
})

/** What the order form edits: everything about an order its customer decides. */
export type OrderInput = z.infer<typeof orderSchema>
