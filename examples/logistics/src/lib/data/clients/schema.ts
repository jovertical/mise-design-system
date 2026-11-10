/** What a form may submit and a write function may accept, for clients: one schema for both. */
import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().trim().min(2, 'Name the client'),
  industry: z.string().trim().min(1, 'Enter an industry'),
  city: z.string().trim().min(1, 'Enter a city'),
  contact: z.string().trim().min(1, 'Name a contact'),
  email: z.email('Enter an email address'),
  manager: z.string().trim().min(1, 'Name the account manager'),
  status: z.enum(['active', 'paused']),
})

/** What the client form edits: everything but the id and the lifetime value. */
export type ClientInput = z.infer<typeof clientSchema>
