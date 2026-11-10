/** What a form may submit and a write function may accept, for warehouses: one schema for both. */
import { z } from 'zod'

export const siteSchema = z.object({
  name: z.string().trim().min(2, 'Name the site'),
  city: z.string().trim().min(1, 'Enter a city'),
  manager: z.string().trim().min(1, 'Name the manager'),
  capacityUnits: z.number().int('Whole units only').positive('Enter the capacity'),
  docks: z.number().int('Whole docks only').min(1, 'At least one dock'),
  zones: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Name the zone'),
        capacity: z.number().int('Whole units only').positive('Enter a capacity'),
      }),
    )
    .min(1, 'Add a zone'),
})

/** What the site form edits; what each zone holds moves with stock, not here. */
export type SiteInput = z.infer<typeof siteSchema>
